/**
 * @jest-environment node
 */

/* eslint-disable @typescript-eslint/unbound-method */

import type { FavoriteRecipes } from "@prisma/client";
import { type RouterInputs } from "@utils/api";
import {
  caller,
  mockFavoriteRecipe,
  mockRecipe,
  mockReview,
  prisma,
  userSession,
} from "../helpers/tests";

describe("userRouter", () => {
  describe("addRecipeToFavorites", () => {
    it("should add recipe to favorites", async () => {
      // make prisma.favoriteRecipes.create return mockFavoriteRecipe
      prisma.favoriteRecipes.create.mockResolvedValueOnce(mockFavoriteRecipe);

      // make prisma.user.findUnique return user session
      prisma.user.findUnique.mockResolvedValueOnce(userSession.user);

      // make prisma.recipe.findUnique return mockOutput
      prisma.recipe.findUnique.mockResolvedValueOnce(mockRecipe);

      // Create the input for the procedure
      const input: RouterInputs["user"]["addRecipeToFavorites"] =
        "test-recipe-id";

      // Call the procedure
      const result = await caller.user.addRecipeToFavorites(input);

      // Expect the result to be the mockOutput
      expect(result).toEqual(mockFavoriteRecipe);
    });

    it("should throw an error if user is not found", async () => {
      // make prisma.user.findUnique return null
      prisma.user.findUnique.mockResolvedValueOnce(null);

      // Create the input for the procedure
      const input: RouterInputs["user"]["addRecipeToFavorites"] =
        "test-recipe-id";

      // Call the procedure
      const result = caller.user.addRecipeToFavorites(input);

      // Expect the result to throw an error
      await expect(result).rejects.toThrowError("User not found");
    });

    it("should throw an error if recipe is not found", async () => {
      // make prisma.user.findUnique return user session
      prisma.user.findUnique.mockResolvedValueOnce(userSession.user);

      // make prisma.recipe.findUnique return null
      prisma.recipe.findUnique.mockResolvedValueOnce(null);

      // Create the input for the procedure
      const input: RouterInputs["user"]["addRecipeToFavorites"] =
        "test-recipe-id";

      // Call the procedure
      const result = caller.user.addRecipeToFavorites(input);

      // Expect the result to throw an error
      await expect(result).rejects.toThrowError("Recipe not found");
    });
  });
  describe("removeRecipeFromFavorites", () => {
    it("should remove recipe from favorites", async () => {
      // make prisma.user.findUnique return user session
      prisma.user.findUnique.mockResolvedValueOnce(userSession.user);

      // make prisma.recipe.findUnique return mockOutput
      prisma.recipe.findUnique.mockResolvedValueOnce(mockRecipe);

      // Create the input for the procedure
      const input: RouterInputs["user"]["removeRecipeFromFavorites"] =
        "test-recipe-id";

      // Call the procedure
      const result = await caller.user.removeRecipeFromFavorites(input);

      // Expect the result to be undefined
      expect(result).toEqual(undefined);
    });

    it("should throw an error if user is not found", async () => {
      // make prisma.user.findUnique return null
      prisma.user.findUnique.mockResolvedValueOnce(null);

      // Create the input for the procedure
      const input: RouterInputs["user"]["removeRecipeFromFavorites"] =
        "test-recipe-id";

      // Call the procedure
      const result = caller.user.removeRecipeFromFavorites(input);

      // Expect the result to throw an error
      await expect(result).rejects.toThrowError("User not found");
    });

    it("should throw an error if recipe is not found", async () => {
      // make prisma.user.findUnique return user session
      prisma.user.findUnique.mockResolvedValueOnce(userSession.user);

      // make prisma.recipe.findUnique return null
      prisma.recipe.findUnique.mockResolvedValueOnce(null);

      // Create the input for the procedure
      const input: RouterInputs["user"]["removeRecipeFromFavorites"] =
        "test-recipe-id";

      // Call the procedure
      const result = caller.user.removeRecipeFromFavorites(input);

      // Expect the result to throw an error
      await expect(result).rejects.toThrowError("Recipe not found");
    });

    it("should only remove the input recipe from favorites if there are more than one favorite recipes", async () => {
      // make prisma.user.findUnique return user session
      prisma.user.findUnique.mockResolvedValueOnce(userSession.user);

      // make prisma.recipe.findUnique return mockOutput
      prisma.recipe.findUnique.mockResolvedValueOnce(mockRecipe);

      // mock a second favorite recipe
      const mockFavoriteRecipe2: FavoriteRecipes = {
        id: "test-favorite-recipe-id-2",
        recipeId: "test-recipe-id-2",
        userId: "test-user-id-2",
      };

      // make prisma.favoriteRecipes.findMany return mockFavoriteRecipe
      prisma.favoriteRecipes.findMany.mockResolvedValueOnce([
        mockFavoriteRecipe,
        mockFavoriteRecipe2,
      ]);

      // Create the input for the procedure
      const input: RouterInputs["user"]["removeRecipeFromFavorites"] =
        "test-favorite-recipe-id";

      // Call the procedure
      const result = await caller.user.removeRecipeFromFavorites(input);

      // Expect the result to be undefined
      expect(result).toEqual(undefined);

      // Expect prisma.favoriteRecipes.delete to be called with the id of the first favorite recipe
      expect(prisma.favoriteRecipes.deleteMany).toBeCalledWith({
        where: {
          recipeId: mockRecipe.id,
          userId: userSession.user.id,
        },
      });

      // Expect the remaining favorite recipe to still be in the database
      expect(prisma.favoriteRecipes.deleteMany).not.toBeCalledWith({
        where: {
          recipeId: "test-recipe-id-2",
          userId: userSession.user.id,
        },
      });
    });
  });

  describe("createReview", () => {
    it("should create a review", async () => {
      // make prisma.review.create return mockReview
      prisma.review.create.mockResolvedValueOnce(mockReview);

      // make prisma.user.findUnique return user session
      prisma.user.findUnique.mockResolvedValueOnce(userSession.user);

      // make prisma.recipe.findUnique return mockOutput
      prisma.recipe.findUnique.mockResolvedValueOnce(mockRecipe);

      // Create the input for the procedure
      const input: RouterInputs["user"]["createReview"] = {
        recipeId: "test-recipe-id",
        stars: 5,
        comments: "test-text",
      };

      // Call the procedure
      const result = await caller.user.createReview(input);

      // Expect the result to be undefined
      expect(result).toEqual(mockReview);
    });

    it("should throw an error if user is not found", async () => {
      // make prisma.user.findUnique return null
      prisma.user.findUnique.mockResolvedValueOnce(null);

      // Create the input for the procedure
      const input: RouterInputs["user"]["createReview"] = {
        recipeId: "test-recipe-id",
        stars: 5,
        comments: "test-text",
      };

      // Call the procedure
      const result = caller.user.createReview(input);

      // Expect the result to throw an error
      await expect(result).rejects.toThrowError("User not found");
    });

    it("should throw an error if recipe is not found", async () => {
      // make prisma.user.findUnique return user session
      prisma.user.findUnique.mockResolvedValueOnce(userSession.user);

      // make prisma.recipe.findUnique return null
      prisma.recipe.findUnique.mockResolvedValueOnce(null);

      // Create the input for the procedure
      const input: RouterInputs["user"]["createReview"] = {
        recipeId: "test-recipe-id",
        stars: 5,
        comments: "test-text",
      };

      // Call the procedure
      const result = caller.user.createReview(input);

      // Expect the result to throw an error
      await expect(result).rejects.toThrowError("Error creating review");
    });
  });
});
