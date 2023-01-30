import { env } from "@/env/server.mjs";
import { AWS } from "@/lib/aws";
import { recipeSchema } from "@/types/zod-schemas";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const s3 = new AWS.S3();

const BUCKET_NAME = env.AWS_BUCKET_NAME;
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

      const recipe = await ctx.prisma.recipe.create({
        data: {
          name: input.name,
          description: input.description,
          servings: input.servings,
          image: input.image,
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
          instructions: input.instructions,
          favorite: input.favorite,
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

      // Upload image to S3 using a presigned URL
      const presignedUrl = s3.createPresignedPost({
        Bucket: BUCKET_NAME,
        Fields: {
          key: `${recipe.id}/${input.image}`,
        },
        Expires: UPLOADING_TIME_LIMIT,
        Conditions: [
          ["content-length-range", 0, UPLOAD_MAX_FILE_SIZE],
          ["starts-with", "$Content-Type", "image/"],
        ],
      });

      return {
        presignedUrl,
        recipe,
      };
    }),

  getRecipes: publicProcedure.query(async ({ ctx }) => {
    const recipes = await ctx.prisma.recipe.findMany({
      where: {
        shared: true,
      },
    });

    return recipes;
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
  getRecipesByFavorite: publicProcedure
    .input(z.boolean())
    .query(async ({ input, ctx }) => {
      const recipes = await ctx.prisma.recipe.findMany({
        where: {
          favorite: input,
        },
      });

      return recipes;
    }),
  getRecipesByShared: publicProcedure
    .input(z.boolean())
    .query(async ({ input, ctx }) => {
      const recipes = await ctx.prisma.recipe.findMany({
        where: {
          shared: input,
        },
      });

      return recipes;
    }),
});
