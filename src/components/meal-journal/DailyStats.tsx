/* This example requires Tailwind CSS v2.0+ */
import type { MealJournalType } from "@/types";
import { api } from "@/utils/api";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/20/solid";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface Props {
  mealJournal: MealJournalType;
  date: Date;
}

export default function DailyStats({ mealJournal, date }: Props) {
  const yesterday = new Date(date.getTime() - 24 * 60 * 60 * 1000);
  const getMealJournalYesterday =
    api.mealJournal.getMealJournal.useQuery(yesterday);

  // Selected Day
  const dayCalories = mealJournal?.mealItems
    ? mealJournal.mealItems.reduce(
        (acc, mealItem) => acc + (mealItem.calories || 0),
        0
      )
    : 0;

  const dayProtein = mealJournal?.mealItems
    ? mealJournal.mealItems.reduce(
        (acc, mealItem) => acc + (mealItem.protein || 0),
        0
      )
    : 0;

  const dayCarbs = mealJournal?.mealItems
    ? mealJournal.mealItems.reduce(
        (acc, mealItem) => acc + (mealItem.carbs || 0),
        0
      )
    : 0;

  const dayFat = mealJournal?.mealItems
    ? mealJournal.mealItems.reduce(
        (acc, mealItem) => acc + (mealItem.fat || 0),
        0
      )
    : 0;

  //  Day before selected day
  const yesterdayCalories = getMealJournalYesterday.data?.mealItems?.reduce(
    (acc, mealItem) =>
      mealItem.calories !== null ? acc + mealItem?.calories : acc,
    0
  );

  const yesterdayProtein = getMealJournalYesterday.data?.mealItems?.reduce(
    (acc, mealItem) =>
      mealItem.protein !== null ? acc + mealItem?.protein : acc,
    0
  );

  const yesterdayCarbs = getMealJournalYesterday.data?.mealItems?.reduce(
    (acc, mealItem) => (mealItem.carbs !== null ? acc + mealItem.carbs : acc),
    0
  );
  const yesterdayFat = getMealJournalYesterday.data?.mealItems?.reduce(
    (acc, mealItem) => (mealItem.fat !== null ? acc + mealItem.fat : acc),
    0
  );

  // Calculate change
  const caloriesChange = yesterdayCalories
    ? Math.round(((dayCalories - yesterdayCalories) / yesterdayCalories) * 100)
    : 0;

  const proteinChange = yesterdayProtein
    ? Math.round(((dayProtein - yesterdayProtein) / yesterdayProtein) * 100)
    : 0;
  const carbsChange = yesterdayCarbs
    ? Math.round(((dayCarbs - yesterdayCarbs) / yesterdayCarbs) * 100)
    : 0;
  const fatChange = yesterdayFat
    ? Math.round(((dayFat - yesterdayFat) / yesterdayFat) * 100)
    : 0;

  // Stats
  const macroStats = [
    {
      name: "Calories",
      stat: dayCalories,
      previousStat: yesterdayCalories,
      change: `${caloriesChange}%`,
      changeType: caloriesChange > 0 ? "increase" : "decrease",
    },
    {
      name: "Protein",
      stat: dayProtein,
      previousStat: yesterdayProtein,
      change: `${proteinChange}%`,
      changeType: proteinChange > 0 ? "increase" : "decrease",
    },
    {
      name: "Carbs",
      stat: dayCarbs,
      previousStat: yesterdayCarbs,
      change: `${carbsChange}%`,
      changeType: carbsChange > 0 ? "increase" : "decrease",
    },
    {
      name: "Fat",
      stat: dayFat,
      previousStat: yesterdayFat,
      change: `${fatChange}%`,
      changeType: fatChange > 0 ? "increase" : "decrease",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl p-6">
      <h3 className="text-xl font-medium leading-6 text-zinc-900 dark:text-zinc-100">
        Meal Journal - {date.toDateString()}
      </h3>
      <dl className="mt-5 grid grid-cols-1 divide-y divide-zinc-200 overflow-hidden rounded-lg bg-zinc-50 shadow dark:divide-zinc-700 dark:bg-zinc-800 sm:grid-cols-2 md:grid-cols-4 md:divide-x md:divide-y-0">
        {macroStats.map((item) => (
          <div key={item.name} className="px-4 py-5 sm:p-6">
            <dt className="text-base font-normal text-zinc-900 dark:text-zinc-100">
              {item.name}
            </dt>
            <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
              <div className="flex items-baseline text-2xl font-semibold text-yellow-600 dark:text-yellow-400">
                {item.stat}
                <span className="ml-2 text-sm font-medium text-zinc-500">
                  from {item.previousStat || 0}
                </span>
              </div>

              <div
                className={classNames(
                  item.name === "Protein"
                    ? item.changeType === "increase"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                    : item.changeType === "increase"
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800",
                  "inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0"
                )}
              >
                {item.changeType === "increase" && item.name === "Protein" ? (
                  <ArrowUpIcon
                    className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-green-500"
                    aria-hidden="true"
                  />
                ) : item.changeType === "decrease" &&
                  item.name === "Protein" ? (
                  <ArrowDownIcon
                    className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-red-500"
                    aria-hidden="true"
                  />
                ) : item.changeType === "increase" ? (
                  <ArrowUpIcon
                    className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-red-500"
                    aria-hidden="true"
                  />
                ) : (
                  <ArrowDownIcon
                    className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-green-500"
                    aria-hidden="true"
                  />
                )}
                <span className="sr-only">
                  {" "}
                  {item.changeType === "increase"
                    ? "Increased"
                    : "Decreased"}{" "}
                  by{" "}
                </span>
                {item.change}
              </div>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
