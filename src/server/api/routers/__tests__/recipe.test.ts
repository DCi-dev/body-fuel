/**
 * @jest-environment node
 */

import type { FavoriteRecipes } from "@prisma/client";
import { type RouterInputs } from "@utils/api";
import {
  caller,
  ctx,
  mockFavoriteRecipe,
  mockLimitedFavoritedRecipes,
  mockLimitedRecipes,
  mockRecipe,
  mockReview,
  prisma,
  userSession,
} from "../helpers/tests";

// Mock AWS client
jest.mock("aws-sdk", () => {
  return {
    S3: jest.fn(() => ({
      createPresignedPost: jest
        .fn()
        .mockReturnValue("http://mock-presigned-url.com"),
      // add other methods you want to mock here
    })),
    config: {
      update: jest.fn(),
    },
  };
});

describe("recipeRouter", () => {
  describe("createRecipe", () => {
    const input: RouterInputs["recipe"]["createRecipe"] = {
      name: "test-recipe-name",
      description: "test-recipe-description",
      servings: 10,
      image: new File([], "test-image-name"),
      ingredients: [
        {
          name: "test-ingredient-name-1",
          quantity: 10,
          calories: 100,
          carbohydrates: 10,
          fat: 10,
          protein: 10,
        },
        {
          name: "test-ingredient-name-2",
          quantity: 20,
          calories: 200,
          carbohydrates: 20,
          fat: 20,
          protein: 20,
        },
      ],
      instructions: [
        {
          text: "test-instruction-text-1",
        },
        {
          text: "test-instruction-text-2",
        },
      ],
      shared: true,
      category: "Breakfast",
      prepTime: "30 min",
      cookTime: "30 min",
      difficulty: "Easy",
    };

    it("should create a recipe", async () => {
      // make prisma.recipe.create return mockRecipe
      prisma.recipe.create.mockResolvedValueOnce(mockRecipe);

      // Call the procedure
      const result = await caller.recipe.createRecipe(input);

      // Expect the result to be the mockOutput
      expect(result).toEqual({
        recipe: mockRecipe,
        presignedUrl: "http://mock-presigned-url.com",
      });
    });

    it("should throw an error if user is not found", async () => {
      // make prisma.user.findUnique return null
      prisma.user.findUnique.mockResolvedValueOnce(null);

      // Call the procedure
      const result = caller.recipe.createRecipe(input);

      // Expect the result to throw an error
      await expect(result).rejects.toThrowError("Something went wrong");
    });
  });

  describe("getLimitedRecipes", () => {
    const input = {
      limit: 10,
      cursor: null,
      search: "test-search",
    };
    it("should get limited recipes", async () => {
      // make prisma.recipe.findMany return mockRecipe
      prisma.recipe.findMany.mockResolvedValueOnce([mockRecipe]);

      // Call the procedure
      const result = await caller.recipe.getLimitedRecipes(input);

      // Expect the result to be the mockOutput
      expect(result).toEqual(mockLimitedRecipes);
    });
  });

  describe("getLimitedFavoritedRecipes", () => {
    const input = {
      limit: 10,
      cursor: null,
      search: "test-search",
    };
    it("should get limited favorited recipes", async () => {
      // make prisma.favoriteRecipes.findMany return mockFavoriteRecipe
      prisma.favoriteRecipes.findMany.mockResolvedValueOnce([
        mockFavoriteRecipe,
      ]);

      // make prisma.recipe.findMany return mockRecipe
      prisma.recipe.findMany.mockResolvedValueOnce([mockRecipe]);

      // Call the procedure
      const result = await caller.recipe.getLimitedFavoritedRecipes(input);

      // Expect the result to be the mockOutput
      expect(result).toEqual(mockLimitedFavoritedRecipes);
    });
  });

  describe("getUserFavoriteRecipe", () => {
    const input = "test-recipe-id";
    it("should get user favorite recipe", async () => {
      // make prisma.recipe.findUnique return mockRecipe
      prisma.recipe.findUnique.mockResolvedValueOnce(mockRecipe);

      // make prisma.favoriteRecipes.findUnique return mockFavoriteRecipe
      prisma.favoriteRecipes.findFirst.mockResolvedValueOnce(
        mockFavoriteRecipe
      );

      // Call the procedure
      const result = await caller.recipe.getUserFavoriteRecipe(input);

      // Expect result to be mockRecipe
      expect(result).toEqual(mockFavoriteRecipe);
    });

    it("should return null if user favorite recipe is not found", async () => {
      // make prisma.recipe.findUnique return mockRecipe
      prisma.recipe.findUnique.mockResolvedValueOnce(mockRecipe);
      // make prisma.favoriteRecipes.findUnique return null
      prisma.favoriteRecipes.findFirst.mockResolvedValueOnce(null);

      // Call the procedure
      const result = await caller.recipe.getUserFavoriteRecipe(input);

      // Expect result to be null
      expect(result).toEqual(null);
    });

    it("should throw an error if recipe is not found", async () => {
      // make prisma.recipe.findUnique return null
      prisma.recipe.findUnique.mockResolvedValueOnce(null);

      // Call the procedure
      const result = caller.recipe.getUserFavoriteRecipe(input);

      // Expect the result to throw an error
      await expect(result).rejects.toThrowError("Recipe not found");
    });
  });

  describe("getRecipes", () => {
    it("should get public/shared recipes", async () => {
      // make prisma.recipe.findMany return mockRecipe
      prisma.recipe.findMany.mockResolvedValueOnce([mockRecipe]);

      // Call the procedure
      const result = await caller.recipe.getRecipes();

      // Expect the result to be the mockOutput
      expect(result).toEqual([mockRecipe]);
    });
  });
});
