import type {
  FavoriteRecipes,
  Ingredient,
  Instructions,
  PrismaClient,
  Recipe,
  Review,
  User,
} from "@prisma/client";
import { appRouter } from "@server/api/root";
import { createInnerTRPCContext } from "@server/api/trpc";
import { mockDeep } from "jest-mock-extended";

// Mocking Prisma client
export const prisma = mockDeep<PrismaClient>();

// Creating session for the user
export const userSession = {
  user: {
    id: "test-user-id",
    name: "test-user-name",
    email: "test-user-email",
    image: "test-user-image",
  } as User,
  expires: new Date().toISOString(),
};

// Creating context with the session and prisma
export const ctx = createInnerTRPCContext({
  session: userSession,
  prisma: prisma,
});

// create a caller for the router with the context
export const caller = appRouter.createCaller(ctx);

// Mock Ingredients
export const mockIngredients: Ingredient[] = [
  {
    id: "test-ingredient-id-1",
    name: "test-ingredient-name-1",
    quantity: 10,
    recipeId: "test-recipe-id",
    calories: 100,
    carbohydrates: 10,
    fat: 10,
    protein: 10,
  },
  {
    id: "test-ingredient-id-2",
    name: "test-ingredient-name-2",
    quantity: 20,
    recipeId: "test-recipe-id",
    calories: 200,
    carbohydrates: 20,
    fat: 20,
    protein: 20,
  },
];

// Mock instructions
export const mockInstructions: Instructions[] = [
  {
    text: "test-instruction-text-1",
    id: "test-instruction-id-1",
    recipeId: "test-recipe-id",
  },
  {
    text: "test-instruction-text-2",
    id: "test-instruction-id-2",
    recipeId: "test-recipe-id",
  },
];

// Mock Recipe
export const mockRecipe: Recipe = {
  id: "test-recipe-id",
  name: "test-recipe-name",
  description: "test-recipe-description",
  servings: 10,
  image: "test-recipe-imageUrl",
  userId: "test-user-id",
  calories: 300,
  carbohydrates: 30,
  fat: 30,
  protein: 30,
  cookTime: "30 min",
  prepTime: "30 min",
  category: "Breakfast",
  shared: true,
  difficulty: "Easy",
  slug: "test-recipe-slug",
};

// Mock favoriteRecipe
export const mockFavoriteRecipe: FavoriteRecipes = {
  id: "test-favorite-recipe-id",
  recipeId: "test-recipe-id",
  userId: "test-user-id",
};

// Mock Review
export const mockReview: Review = {
  id: "test-review-id",
  comments: "test-review-comments",
  stars: 5,
  recipeId: "test-recipe-id",
  userId: "test-user-id",
};

// Mock limitedRecipes
export const mockLimitedRecipes = {
  nextCursor: undefined,
  recipesWithDetails: [
    {
      calories: 300,
      carbohydrates: 30,
      category: "Breakfast",
      cookTime: "30 min",
      description: "test-recipe-description",
      difficulty: "Easy",
      fat: 30,
      id: "test-recipe-id",
      image: "test-recipe-imageUrl",
      ingredients: undefined,
      instructions: undefined,
      name: "test-recipe-name",
      prepTime: "30 min",
      protein: 30,
      servings: 10,
      shared: true,
      slug: "test-recipe-slug",
      user: null,
      userId: "test-user-id",
    },
  ],
};

// Mock limitedFavoritedRecipes
export const mockLimitedFavoritedRecipes = {
  nextCursor: undefined,
  recipesWithDetails: [
    {
      calories: 300,
      carbohydrates: 30,
      category: "Breakfast",
      cookTime: "30 min",
      description: "test-recipe-description",
      difficulty: "Easy",
      fat: 30,
      id: "test-recipe-id",
      image: "test-recipe-imageUrl",
      ingredients: undefined,
      instructions: undefined,
      name: "test-recipe-name",
      prepTime: "30 min",
      protein: 30,
      servings: 10,
      shared: true,
      slug: "test-recipe-slug",
      user: undefined,
      userId: "test-user-id",
    },
  ],
};

// Mock recipe that is not shared
export const mockRecipeNotShared: Recipe = {
  id: "test-recipe-id",
  name: "test-recipe-name",
  description: "test-recipe-description",
  servings: 10,
  image: "test-recipe-imageUrl",
  userId: "test-user-id",
  calories: 300,
  carbohydrates: 30,
  fat: 30,
  protein: 30,
  cookTime: "30 min",
  prepTime: "30 min",
  category: "Breakfast",
  shared: false,
  difficulty: "Easy",
  slug: "test-recipe-slug",
};

// Mock getRecipe result
export const mockGetRecipeResult = {
  calories: 300,
  carbohydrates: 30,
  category: "Breakfast",
  cookTime: "30 min",
  description: "test-recipe-description",
  difficulty: "Easy",
  fat: 30,
  id: "test-recipe-id",
  image: "test-recipe-imageUrl",
  ingredients: [
    {
      calories: 100,
      carbohydrates: 10,
      fat: 10,
      id: "test-ingredient-id-1",
      name: "test-ingredient-name-1",
      protein: 10,
      quantity: 10,
      recipeId: "test-recipe-id",
    },
    {
      calories: 200,
      carbohydrates: 20,
      fat: 20,
      id: "test-ingredient-id-2",
      name: "test-ingredient-name-2",
      protein: 20,
      quantity: 20,
      recipeId: "test-recipe-id",
    },
  ],
  instructions: [
    {
      id: "test-instruction-id-1",
      recipeId: "test-recipe-id",
      text: "test-instruction-text-1",
    },
    {
      id: "test-instruction-id-2",
      recipeId: "test-recipe-id",
      text: "test-instruction-text-2",
    },
  ],
  name: "test-recipe-name",
  prepTime: "30 min",
  protein: 30,
  reviewWithUserDetails: [
    {
      comments: "test-review-comments",
      id: "test-review-id",
      recipeId: "test-recipe-id",
      stars: 5,
      user: undefined,
      userId: "test-user-id",
    },
  ],
  servings: 10,
  shared: true,
  slug: "test-recipe-slug",
  user: {
    email: "test-user-email",
    id: "test-user-id",
    image: "test-user-image",
    name: "test-user-name",
  },
  userId: "test-user-id",
};
