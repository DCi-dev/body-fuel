import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getFavoriteRecipes: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user?.id;

    const favoriteRecipes = await ctx.prisma.favoriteRecipes.findMany({
      where: {
        userId: userId,
      },
    });

    return favoriteRecipes;
  }),

  addRecipeToFavorites: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;

      const user = await ctx.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const recipe = await ctx.prisma.recipe.findUnique({
        where: {
          id: input,
        },
      });

      if (!recipe) {
        throw new Error("Recipe not found");
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
        throw new Error("User not found");
      }

      const recipe = await ctx.prisma.recipe.findUnique({
        where: {
          id: input,
        },
      });

      if (!recipe) {
        throw new Error("Recipe not found");
      }

      const favoriteRecipe = await ctx.prisma.favoriteRecipes.deleteMany({
        where: {
          recipeId: recipe.id,
          userId: user.id,
        },
      });

      return favoriteRecipe;
    }),
});
