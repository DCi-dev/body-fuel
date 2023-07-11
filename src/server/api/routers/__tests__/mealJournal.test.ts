/**
 * @jest-environment node
 */

import { type RouterInputs } from "@utils/api";
import {
  caller,
  mockMealItem,
  mockMealJournalInput,
  mockMealJournalOutput,
  prisma,
  userSession,
} from "../helpers/tests";

describe("mealJournalRouter", () => {
  describe("addToMealJournal", () => {
    it("should add a meal journal", async () => {
      // Mock output of the addToMealJournal procedure
      const output = {
        ...mockMealItem,
        date: new Date(),
        userId: userSession.user.id,
      };

      // Mocking Prisma client output
      prisma.mealJournal.create.mockResolvedValue(output);

      // Mocking input
      const input: RouterInputs["mealJournal"]["addToMealJournal"] =
        mockMealJournalInput;

      // Calling the procedure
      const result = await caller.mealJournal.addToMealJournal(input);

      // Asserting the result
      expect(result).toEqual(output);
    });
  });

  describe("updateJournalItem", () => {
    it("should update a meal journal item", async () => {
      // Mock output of the addToMealJournal procedure
      const output = {
        ...mockMealItem,
        date: new Date(),
        userId: userSession.user.id,
      };

      // Mock prisma.mealJournal.findFirst
      prisma.mealJournal.findFirst.mockResolvedValue({
        id: output.id,
        date: output.date,
        userId: output.userId,
      });

      // Mock prisma.mealItem.findFirst
      prisma.mealItem.findFirst.mockResolvedValue(mockMealItem);

      // Mocking Prisma client output
      prisma.mealItem.update.mockResolvedValue(output);

      // Mocking input
      const input: RouterInputs["mealJournal"]["updateJournalItem"] = {
        journalId: output.id,
        servings: output.servings,
        itemId: output.id,
        calories: output.calories || 300,
        protein: output.protein || 30,
        carbs: output.carbs || 30,
        fat: output.fat || 30,
      };

      // Calling the procedure
      const result = await caller.mealJournal.updateJournalItem(input);

      // Asserting the result
      expect(result).toEqual(output);
    });

    it("should throw an error if the meal journal does not exist", async () => {
      // Mock prisma.mealJournal.findFirst
      prisma.mealJournal.findFirst.mockResolvedValue(null);

      // Mocking input
      const input: RouterInputs["mealJournal"]["updateJournalItem"] = {
        journalId: "test-journal-id",
        servings: 10,
        itemId: "test-item-id",
        calories: 300,
        protein: 30,
        carbs: 30,
        fat: 30,
      };

      // Calling the procedure
      const result = caller.mealJournal.updateJournalItem(input);

      // Asserting the result
      await expect(result).rejects.toThrow("Journal not found");
    });

    it("should throw an error if the meal item does not exist", async () => {
      // Mock prisma.mealJournal.findFirst
      prisma.mealJournal.findFirst.mockResolvedValue({
        id: "test-journal-id",
        date: new Date(),
        userId: "test-user-id",
      });

      // Mock prisma.mealItem.findFirst
      prisma.mealItem.findFirst.mockResolvedValue(null);

      // Mocking input
      const input: RouterInputs["mealJournal"]["updateJournalItem"] = {
        journalId: "test-journal-id",
        servings: 10,
        itemId: "test-item-id",
        calories: 300,
        protein: 30,
        carbs: 30,
        fat: 30,
      };

      // Calling the procedure
      const result = caller.mealJournal.updateJournalItem(input);

      // Asserting the result
      await expect(result).rejects.toThrow("Meal item not found");
    });
  });

  describe("deleteJournalItem", () => {
    it("should delete a meal journal item", async () => {
      // Mock output of the deleteJournalItem procedure
      const output = {
        ...mockMealItem,
        date: new Date(),
        userId: userSession.user.id,
      };

      // Mock prisma.mealJournal.findFirst
      prisma.mealJournal.findFirst.mockResolvedValue({
        id: output.id,
        date: output.date,
        userId: output.userId,
      });

      // Mock prisma.mealItem.findFirst
      prisma.mealItem.findFirst.mockResolvedValue(mockMealItem);

      // Mocking Prisma client output
      prisma.mealItem.delete.mockResolvedValue(output);

      // Mocking input
      const input: RouterInputs["mealJournal"]["deleteJournalItem"] = {
        journalId: output.id,
        itemId: output.id,
      };

      // Calling the procedure
      const result = await caller.mealJournal.deleteJournalItem(input);

      // Asserting the result
      expect(result).toEqual(output);
    });

    it("should throw an error if the meal journal does not exist", async () => {
      // Mock prisma.mealJournal.findFirst
      prisma.mealJournal.findFirst.mockResolvedValue(null);

      // Mocking input
      const input: RouterInputs["mealJournal"]["deleteJournalItem"] = {
        journalId: "test-journal-id",
        itemId: "test-item-id",
      };

      // Calling the procedure
      const result = caller.mealJournal.deleteJournalItem(input);

      // Asserting the result
      await expect(result).rejects.toThrow("Journal not found");
    });

    it("should throw an error if the meal item does not exist", async () => {
      // Mock prisma.mealJournal.findFirst
      prisma.mealJournal.findFirst.mockResolvedValue({
        id: "test-journal-id",
        date: new Date(),
        userId: "test-user-id",
      });

      // Mock prisma.mealItem.findFirst
      prisma.mealItem.findFirst.mockResolvedValue(null);

      // Mocking input
      const input: RouterInputs["mealJournal"]["deleteJournalItem"] = {
        journalId: "test-journal-id",
        itemId: "test-item-id",
      };

      // Calling the procedure
      const result = caller.mealJournal.deleteJournalItem(input);

      // Asserting the result
      await expect(result).rejects.toThrow("Meal item not found");
    });
  });

  describe("getMealJournal", () => {
    it("should get a meal journal", async () => {
      // Mocking input
      const input: RouterInputs["mealJournal"]["getMealJournal"] = new Date();

      // Mock prisma.mealJournal.findFirst
      prisma.mealJournal.findFirst.mockResolvedValue({
        ...mockMealJournalOutput,
        date: input,
      });

      // Mock prisma.mealItem.findMany
      prisma.mealItem.findMany.mockResolvedValueOnce([mockMealItem]);

      // Calling the procedure
      const result = await caller.mealJournal.getMealJournal(input);

      // Mock output of the getMealJournal procedure
      const output = {
        ...mockMealJournalOutput,
        date: input,
      };
      // Asserting the result
      expect(result).toEqual(output);
    });

    it("should throw an error if the meal journal does not exist", () => {
      // Mocking input
      const input: RouterInputs["mealJournal"]["getMealJournal"] = new Date();

      // Mock prisma.mealJournal.findFirst
      prisma.mealJournal.findFirst.mockResolvedValue(null);

      // Calling the procedure
      const result = caller.mealJournal.getMealJournal(input);

      // Asserting the result to be null
      expect(result).resolves.toBeNull();
    });
  });
});
