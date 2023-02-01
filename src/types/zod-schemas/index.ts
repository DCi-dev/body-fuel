import { z } from "zod";

export const recipeSchema = z.object({
  name: z.string(),
  description: z.string(),
  servings: z.number(),
  image: z.custom<File>(),
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
  instructions: z.array(
    z.object({
      text: z.string(),
    })
  ),
  shared: z.boolean().optional(),
  category: z.string(),
  prepTime: z.string().optional(),
  cookTime: z.string().optional(),
  difficulty: z.string().optional(),
});
