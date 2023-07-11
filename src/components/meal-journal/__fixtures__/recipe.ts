import type { RecipeType } from "@/types";

export const recipe: RecipeType = {
  id: "test-id",
  name: "Test Recipe",
  description: "Test Description",
  calories: 100,
  protein: 10,
  fat: 10,
  carbohydrates: 10,
  category: "Breakfast",
  cookTime: "10 minutes",
  prepTime: "10 minutes",
  difficulty: "Easy",
  image: "test-image",
  servings: 1,
  shared: false,
  slug: "test-recipe",
  userId: "test-user-id",
  user: {
    id: "test-user-id",
    name: "test-user-name",
    image: "test-user-image",
  },
  ingredients: [
    {
      id: "test-ingredient-id",
      name: "test-ingredient-name",
      quantity: 1,
      calories: 100,
      protein: 10,
      fat: 10,
      carbohydrates: 10,
    },
  ],
  instructions: [
    {
      id: "test-instruction-id",
      recipeId: "test-recipe-id",
      text: "test-instruction-text",
    },
  ],
};
