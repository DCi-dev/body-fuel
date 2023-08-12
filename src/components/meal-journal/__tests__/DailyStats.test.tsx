import { render } from "@testing-library/react";
import DailyStats from "../DailyStats";

const mealJournalToday = {
  mealItems: [
    { calories: 400, protein: 30, carbs: 50, fat: 20 },
    { calories: 600, protein: 40, carbs: 70, fat: 30 },
  ],
};

// mock data for yesterday's journal
const mealJournalYesterday = {
  mealItems: [
    { calories: 300, protein: 20, carbs: 30, fat: 10 },
    { calories: 500, protein: 30, carbs: 40, fat: 20 },
  ],
};

// Mock the trpc api calls
jest.mock("@utils/api", () => ({
  api: {
    mealJournal: {
      getMealJournal: {
        useQuery: () => ({
          data: mealJournalYesterday,
        }),
      },
    },
  },
}));

describe("DailyStats", () => {
  it("should render the daily stats correctly", () => {
    const { getByText } = render(
      <DailyStats mealJournal={mealJournalToday} date={new Date()} />,
    );
    // Day stats
    expect(getByText("Calories")).toBeDefined();
    expect(getByText("1000")).toBeDefined(); // total calories today
    expect(getByText("70")).toBeDefined(); // total protein today
    expect(getByText("120")).toBeDefined(); // total carbs today
    expect(getByText("50")).toBeDefined(); // total fat today

    // Change from yesterday
    expect(getByText("67%")).toBeDefined(); // calories increase percentage
    expect(getByText("67%")).toHaveClass("text-red-800"); // calories increase percentage color should be red
    expect(getByText("40%")).toBeDefined(); // protein increase percentage
    expect(getByText("40%")).toHaveClass("text-green-800"); // protein increase percentage color should be green
    expect(getByText("71%")).toBeDefined(); // carbs increase percentage
    expect(getByText("71%")).toHaveClass("text-red-800"); // carbs increase percentage color should be red
    expect(getByText("67%")).toBeDefined(); // fat increase percentage
  });
});
