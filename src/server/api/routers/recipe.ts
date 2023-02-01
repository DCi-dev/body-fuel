import { env } from "@/env/server.mjs";
import { AWS } from "@/lib/aws";
import { recipeSchema } from "@/types/zod-schemas";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const s3 = new AWS.S3();

const BUCKET_NAME = env.AWS_BUCKET_NAME;
const REGION = env.AWS_REGION;
const UPLOADING_TIME_LIMIT = 30;
const UPLOAD_MAX_FILE_SIZE = 1000000;

export const recipeRouter = createTRPCRouter({
  createRecipe: protectedProcedure
    .input(recipeSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user?.id;

      if (!userId) {
        throw new Error("Not authenticated");
      }

      try {
        // check if the recipe slug already exists
        const existingRecipe = await ctx.prisma.recipe.findUnique({
          where: {
            slug: input.slug,
          },
        });

        let counter = 1;

        while (existingRecipe) {
          const newSlug = `${input.slug as string}-${counter}`;
          const newRecipe = await ctx.prisma.recipe.findUnique({
            where: {
              slug: newSlug,
            },
          });

          if (!newRecipe) {
            input.slug = newSlug;
            break;
          }

          counter++;
        }

        const recipe = await ctx.prisma.recipe.create({
          data: {
            name: input.name,
            slug: input.slug || "",
            description: input.description,
            servings: input.servings,
            image: "",
            ingredients: {
              create: input.ingredients.map((ingredient) => ({
                name: ingredient.name,
                quantity: ingredient.quantity,
                calories: ingredient.calories,
                protein: ingredient.protein,
                carbohydrates: ingredient.carbohydrates,
                fat: ingredient.fat,
              })),
            },
            // Add the total calories based on the ingredients calories field
            calories: input.ingredients.reduce(
              (acc: number, ingredient) =>
                ingredient?.calories !== undefined
                  ? acc + ingredient.calories
                  : acc,
              0
            ),
            protein: input.ingredients.reduce(
              (acc: number, ingredient) =>
                ingredient?.protein !== undefined
                  ? acc + ingredient.protein
                  : acc,
              0
            ),
            carbohydrates: input.ingredients.reduce(
              (acc: number, ingredient) =>
                ingredient?.carbohydrates !== undefined
                  ? acc + ingredient.carbohydrates
                  : acc,
              0
            ),
            fat: input.ingredients.reduce(
              (acc: number, ingredient) =>
                ingredient?.fat !== undefined ? acc + ingredient.fat : acc,
              0
            ),
            instructions: {
              create: input.instructions.map((instruction) => ({
                text: instruction.text,
              })),
            },
            shared: input.shared,
            categories: {
              connectOrCreate: {
                where: {
                  name: input.category,
                },
                create: { name: input.category },
              },
            },
            prepTime: input.prepTime,
            cookTime: input.cookTime,
            difficulty: input.difficulty,
            user: {
              connect: {
                id: userId,
              },
            },
          },
        });

        const presignedUrl = s3.createPresignedPost({
          Bucket: BUCKET_NAME,
          Fields: {
            key: `${userId}/${recipe.id}`,
          },
          Expires: UPLOADING_TIME_LIMIT,
          Conditions: [
            ["content-length-range", 0, UPLOAD_MAX_FILE_SIZE],
            ["starts-with", "$Content-Type", "image/"],
          ],
        });

        // update image field with the presigned url
        await ctx.prisma.recipe.update({
          where: {
            id: recipe.id,
          },
          data: {
            image: `https://${BUCKET_NAME}.${REGION}.s3.amazonaws.com/${userId}/${recipe.id}`,
          },
        });

        return {
          presignedUrl,
          recipe,
        };
      } catch (error) {
        console.log(error);
      }
    }),

  getRecipes: publicProcedure.query(async ({ ctx }) => {
    const recipes = await ctx.prisma.recipe.findMany({
      where: {
        shared: true,
      },
    });
    // get all the recipes details from the database - shared recipes only
    const recipesWithDetails = await Promise.all(
      recipes.map(async (recipe) => {
        const ingredients = await ctx.prisma.ingredient.findMany({
          where: {
            recipeId: recipe.id,
          },
        });

        const instructions = await ctx.prisma.instructions.findMany({
          where: {
            recipeId: recipe.id,
          },
        });

        const category = await ctx.prisma.category.findMany({
          where: {
            recipes: {
              some: {
                id: recipe.id,
              },
            },
          },
        });

        return {
          ...recipe,
          ingredients,
          category,
          instructions,
        };
      })
    );

    return recipesWithDetails;
  }),
  getUserRecipes: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user?.id;

    if (!userId) {
      throw new Error("Not authenticated");
    }

    const recipes = await ctx.prisma.recipe.findMany({
      where: {
        userId,
      },
    });

    return recipes;
  }),
  getRecipe: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const recipe = await ctx.prisma.recipe.findUnique({
      where: {
        id: input,
      },
    });

    return recipe;
  }),
  deleteRecipe: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user?.id;

      if (!userId) {
        throw new Error("Not authenticated");
      }

      const recipe = await ctx.prisma.recipe.delete({
        where: {
          id: input,
        },
      });

      return recipe;
    }),
  getCategories: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.prisma.category.findMany();

    return categories;
  }),
  getRecipesByCategory: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const recipes = await ctx.prisma.recipe.findMany({
        where: {
          categories: {
            some: {
              name: input,
            },
          },
        },
      });

      return recipes;
    }),
  getRecipesByUser: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const recipes = await ctx.prisma.recipe.findMany({
        where: {
          userId: input,
        },
      });

      return recipes;
    }),
  getRecipesByDifficulty: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const recipes = await ctx.prisma.recipe.findMany({
        where: {
          difficulty: input,
        },
      });

      return recipes;
    }),
  getRecipesByPrepTime: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const recipes = await ctx.prisma.recipe.findMany({
        where: {
          prepTime: {
            lte: input,
          },
        },
      });

      return recipes;
    }),
  getRecipesByCookTime: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const recipes = await ctx.prisma.recipe.findMany({
        where: {
          cookTime: {
            lte: input,
          },
        },
      });

      return recipes;
    }),
  getRecipesByServings: publicProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      const recipes = await ctx.prisma.recipe.findMany({
        where: {
          servings: {
            lte: input,
          },
        },
      });

      return recipes;
    }),
});
