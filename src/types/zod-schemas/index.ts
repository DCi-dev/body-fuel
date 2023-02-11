import { z } from "zod";

// Recipe
export const difficultyEnum = z.enum(["Easy", "Medium", "Hard", "MasterChef"]);
const categoryEnum = z.enum([
  "Breakfast",
  "Salads",
  "MainCourse",
  "Sides",
  "Snacks",
  "Desserts",
  "Drinks",
  "SaucesAndDressings",
]);

const ingredientSchema = z.object({
  name: z.string(),
  quantity: z.number(),
  calories: z.number().optional(),
  protein: z.number().optional(),
  carbohydrates: z.number().optional(),
  fat: z.number().optional(),
});

const instructionSchema = z.object({
  text: z.string(),
});

export const recipeSchema = z.object({
  name: z.string(),
  slug: z.string().optional(),
  description: z.string(),
  servings: z.number(),
  image: z.custom<File>(),
  ingredients: z.array(ingredientSchema),
  instructions: z.array(instructionSchema),
  shared: z.boolean().optional(),
  category: categoryEnum.optional(),
  prepTime: z.string().optional(),
  cookTime: z.string().optional(),
  difficulty: difficultyEnum.optional(),
});

export const reviewSchema = z.object({
  recipeId: z.string(),
  stars: z.number(),
  comments: z.string(),
});

// Meal Journal
export const MealItemSchema = z.object({
  id: z.string(),
  mealJournalId: z.string(),
  recipeId: z.string(),
  servings: z.number().positive(),
  calories: z.number().optional(),
  protein: z.number().optional(),
  carbs: z.number().optional(),
  fat: z.number().optional(),
});

export const MealJournalSchema = z.object({
  id: z.string().optional(),
  date: z.date(),
  userId: z.string().optional(),
  mealItems: z.array(MealItemSchema),
});
