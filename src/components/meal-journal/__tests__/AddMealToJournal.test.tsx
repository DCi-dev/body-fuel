import { act, fireEvent, render } from "@testing-library/react";
import { toast } from "react-hot-toast";
import AddMealToJournal from "../AddMealToJournal";
import { recipe } from "../__fixtures__/recipe";

// Mock the trpc api calls
jest.mock("@utils/api", () => ({
  api: {
    mealJournal: {
      addToMealJournal: {
        useMutation: () => ({ mutateAsync: jest.fn() }),
      },
    },
  },
}));

jest.mock("react-hot-toast");

const mockToast = toast as jest.Mocked<typeof toast>;

describe("AddMealToJournal", () => {
  it("should add a meal to the meal journal", async () => {
    // Mock open modal
    const mockSetOpen = jest.fn();

    const { getByText, getByLabelText } = render(
      <AddMealToJournal recipe={recipe} open={true} setOpen={mockSetOpen} />
    );
    // Select 2 servings
    const servingsInput = getByLabelText("Servings");
    fireEvent.change(servingsInput, { target: { value: "2" } });

    // Select date
    const dateInput = getByLabelText("Date");
    fireEvent.change(dateInput, { target: { value: "2023-07-23" } });

    // Click add to meal journal button
    const addToMealJournalButton = getByText("Add to Journal");
    fireEvent.click(addToMealJournalButton);

    // Loading toast should be called
    expect(mockToast.loading).toHaveBeenCalledWith("Adding to meal journal...");

    // Mock await addToMealJournal.mutateAsync(mealJournal);
    await act(async () => {
      await Promise.resolve();
    });

    // Dismiss loading toast
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockToast.dismiss).toHaveBeenCalled();

    // Success toast should be called
    expect(mockToast.success).toHaveBeenCalledWith("Added to meal journal!");

    // setOpen should be called with false
    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });
});
