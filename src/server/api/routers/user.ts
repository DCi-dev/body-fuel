import { z } from "zod";

import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  addRecipeToFavorites: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;

      const user = await ctx.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const recipe = await ctx.prisma.recipe.findUnique({
        where: {
          id: input,
        },
      });

      if (!recipe) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Recipe not found",
        });
      }

      const favoriteRecipe = await ctx.prisma.favoriteRecipes.create({
        data: {
          recipe: {
            connect: {
              id: recipe.id,
            },
          },
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      return favoriteRecipe;
    }),
  removeRecipeFromFavorites: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;

      const user = await ctx.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const recipe = await ctx.prisma.recipe.findUnique({
        where: {
          id: input,
        },
      });

      if (!recipe) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Recipe not found",
        });
      }

      const favoriteRecipe = await ctx.prisma.favoriteRecipes.deleteMany({
        where: {
          recipeId: recipe.id,
          userId: user.id,
        },
      });

      return favoriteRecipe;
    }),

  createReview: protectedProcedure
    .input(
      z.object({
        recipeId: z.string(),
        stars: z.number(),
        comments: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;

      const user = await ctx.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      try {
        const recipe = await ctx.prisma.recipe.findUnique({
          where: {
            id: input.recipeId,
          },
        });

        if (!recipe) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Recipe not found",
          });
        }

        const review = await ctx.prisma.review.create({
          data: {
            recipe: {
              connect: {
                id: recipe.id,
              },
            },
            user: {
              connect: {
                id: user.id,
              },
            },
            stars: input.stars,
            comments: input.comments,
          },
        });

        return review;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error creating review",
          cause: error,
        });
      }
    }),
});
