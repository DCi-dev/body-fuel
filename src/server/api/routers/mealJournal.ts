import { MealJournalSchema } from "@/types/zod-schemas";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const mealJournalRouter = createTRPCRouter({
  addToMealJournal: protectedProcedure
    .input(MealJournalSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const mealJournal = await ctx.prisma.mealJournal.findFirst({
        where: {
          userId,
          date: input.date,
        },
      });
      if (mealJournal) {
        return ctx.prisma.mealJournal.update({
          where: {
            id: mealJournal.id,
          },
          data: {
            mealItems: {
              create: input.mealItems,
            },
          },
        });
      } else {
        return ctx.prisma.mealJournal.create({
          data: {
            date: input.date,
            userId,
            mealItems: {
              create: input.mealItems,
            },
          },
        });
      }
    }),

  updateJournalItem: protectedProcedure
    .input(
      z.object({
        journalId: z.string(),
        itemId: z.string(),
        servings: z.number().positive(),
        calories: z.number().optional(),
        protein: z.number().optional(),
        carbs: z.number().optional(),
        fat: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      if (!userId) {
        throw new Error("User not logged in");
      }
      const mealJournal = await ctx.prisma.mealJournal.findFirst({
        where: {
          userId,
          id: input.journalId,
        },
      });
      if (!mealJournal) {
        throw new Error("Journal not found");
      }
      const mealItem = await ctx.prisma.mealItem.findFirst({
        where: {
          id: input.itemId,
          mealJournalId: input.journalId,
        },
      });
      if (!mealItem) {
        throw new Error("Meal item not found");
      }
      return ctx.prisma.mealItem.update({
        where: {
          id: input.itemId,
        },
        data: {
          servings: input.servings,
          calories: input.calories,
          protein: input.protein,
          carbs: input.carbs,
          fat: input.fat,
        },
      });
    }),

  deleteJournalItem: protectedProcedure
    .input(
      z.object({
        journalId: z.string(),
        itemId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      if (!userId) {
        throw new Error("User not logged in");
      }
      const mealJournal = await ctx.prisma.mealJournal.findFirst({
        where: {
          userId,
          id: input.journalId,
        },
      });
      if (!mealJournal) {
        throw new Error("Journal not found");
      }
      const mealItem = await ctx.prisma.mealItem.findFirst({
        where: {
          id: input.itemId,
          mealJournalId: input.journalId,
        },
      });
      if (!mealItem) {
        throw new Error("Meal item not found");
      }
      return ctx.prisma.mealItem.delete({
        where: {
          id: input.itemId,
        },
      });
    }),

  deleteJournal: protectedProcedure
    .input(
      z.object({
        journalId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      if (!userId) {
        throw new Error("User not logged in");
      }
      const mealJournal = await ctx.prisma.mealJournal.findFirst({
        where: {
          userId,
          id: input.journalId,
        },
      });
      if (!mealJournal) {
        throw new Error("Journal not found");
      }
      return ctx.prisma.mealJournal.delete({
        where: {
          id: input.journalId,
        },
      });
    }),

  getMealJournal: protectedProcedure
    .input(z.date())
    .query(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      return ctx.prisma.mealJournal.findFirst({
        where: {
          userId,
          date: input,
        },
      });
    }),

  getMealJournalByDateRange: protectedProcedure
    .input(z.object({ startDate: z.date(), endDate: z.date() }))
    .query(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      return ctx.prisma.mealJournal.findMany({
        where: {
          userId,
          date: {
            gte: input.startDate,
            lte: input.endDate,
          },
        },
      });
    }),

  getLastWeekMealJournal: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    return ctx.prisma.mealJournal.findMany({
      where: {
        userId,
        date: {
          gte: lastWeek,
          lte: today,
        },
      },
    });
  }),
});
