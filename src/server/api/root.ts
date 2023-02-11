import { mealJournalRouter } from "./routers/mealJournal";
import { recipeRouter } from "./routers/recipe";
import { userRouter } from "./routers/user";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  recipe: recipeRouter,
  user: userRouter,
  mealJournal: mealJournalRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
