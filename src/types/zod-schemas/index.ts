import { z } from "zod";

export const recipeSchema = z.object({
  name: z.string(),
  description: z.string(),
  servings: z.number(),
  image: z.string(),
  ingredients: z.array(
    z.object({
      name: z.string(),
      quantity: z.number(),
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
});
