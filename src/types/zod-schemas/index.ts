import { z } from "zod";

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
