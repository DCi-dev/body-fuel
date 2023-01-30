import { env } from "@/env/server.mjs";
import { AWS } from "@/lib/aws";
import { create } from "domain";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const s3 = new AWS.S3();

const BUCKET_NAME = env.AWS_BUCKET_NAME
const UPLOADING_TIME_LIMIT = 30;
const UPLOAD_MAX_FILE_SIZE = 1000000;

export const recipeRouter = createTRPCRouter({
  createRecipe: protectedProcedure
    .input({
      name: z.string(),
      description: z.string(),
      servings: z.number(),
      image: z.string(),
      ingredients: z.array(
        z.object({
          name: z.string(),
          quantity: z.string(),
          calories: z.number().optional(),
          protein: z.number().optional(),
          carbohydrates: z.number().optional(),
          fat: z.number().optional(),
        })
      ),
      instructions: z.array(z.string()),
      favorite: z.boolean().optional(),
      shared: z.boolean().optional(),
      category: z.string(),
      prepTime: z.number().optional(),
      cookTime: z.number().optional(),
      difficulty: z.string().optional(),
    })
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user?.id;

      if (!userId) {
        throw new Error("Not authenticated");
      }

       // find or create the category
      const category = await ctx.prisma.category.findFirst({
        where: {
          name: input.category,
        },
      });

      if (!category) {
        const newCategory =  await ctx.prisma.category.create({
          data: {
            name: input.category,
          },
        });

        return newCategory;

      }



      const recipe = await ctx.prisma.recipe.create({
        data: {
          name: input.name,
          description: input.description,
          servings: input.servings,
          image: input.image,
          ingredients: {
            create: input.ingredients,
          },
          instructions: input.instructions.map((instruction: string) => ({
              text: instruction,
            })),
          favorite: input.favorite,
          shared: input.shared,
          // find if the category exists, if not create it
          cateogry: {
            connectOrCreate: {
              where: {
                name: input.category,
            },
            create: {
              name: input.category,
            },
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

      // create presign url for the image
      const presignedUrl = s3.getSignedUrl("putObject", {
        Bucket: BUCKET_NAME,
        Key: recipe.id,
        Expires: UPLOADING_TIME_LIMIT,
      });

      return {
        presignedUrl,
        recipe,
      };
    }),
  getRecipes: publicProcedure
    .query(async ({ input, ctx }) => {
      const recipes = await ctx.prisma.recipe.findMany({
        where: {
          shared: true,
        },
      });
      
      return recipes;
    }),
  getUserRecipes: protectedProcedure
    .query(async ({ input, ctx }) => {
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
  getRecipe: publicProcedure
    .input({
      id: z.string(),
    })
    .query(async ({ input, ctx }) => {
      const recipe = await ctx.prisma.recipe.findUnique({
        where: {
          id: input.id,
        },
      });

      return recipe;
    }),
  updateRecipe: protectedProcedure
    .input({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      servings: z.number(),
      image: z.string(),
      ingredients: z.array(
        z.object({
          name: z.string(),
          quantity: z.string(),
          calories: z.number().optional(),
          protein: z.number().optional(),
          carbohydrates: z.number().optional(),
          fat: z.number().optional(),
        })
      ),
      instructions: z.array(z.string()),
      favorite: z.boolean().optional(),
      shared: z.boolean().optional(),
      category: z.string(),
      prepTime: z.number().optional(),
      cookTime: z.number().optional(),
      difficulty: z.string().optional(),
    })
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user?.id;

      if (!userId) {
        throw new Error("Not authenticated");
      }

      const recipe = await ctx.prisma.recipe.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
          servings: input.servings,
          image: input.image,
          ingredients: {
            create: input.ingredients,
          },
          instructions: input.instructions.map((instruction: string) => ({
              text: instruction,
            })),
          favorite: input.favorite,
          shared: input.shared,
          // find if the category exists, if not create it
          category: {
            connectOrCreate: {
              where: {
                name: input.category,
              },
              create: {
                name: input.category,
              },
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

      return recipe;
    }