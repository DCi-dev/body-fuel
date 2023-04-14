import DailyStats from "@/components/meal-journal/DailyStats";
import MealItemsList from "@/components/meal-journal/MealItemsList";
import { getServerAuthSession } from "@/server/auth";
import type { MealJournalItemType, MealJournalType } from "@/types";
import { api } from "@/utils/api";
import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";

const Dashboard: NextPage = () => {
  const [date, setDate] = useState(new Date());

  const getMealJournal = api.mealJournal.getMealJournal.useQuery(date);

  const mealItems = getMealJournal.data?.mealItems as
    | MealJournalItemType[]
    | undefined;

  const mealJournalId = getMealJournal.data?.id;

  return (
    <>
      <Head>
        <title>Body Fuel - Dashboard</title>
        <meta name="description" content="Healthy Lifestyle" />
      </Head>
      <main className="min-h-screen bg-zinc-100 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b-2 border-zinc-200 px-6 py-6 dark:border-zinc-800 md:px-16 lg:px-32">
          <h1 className="text-2xl text-zinc-900 dark:text-zinc-100 lg:text-4xl">
            Dashboard
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="relative mt-1 rounded-md shadow-sm">
              <input
                type="date"
                name="date"
                className="block w-full rounded-md border-zinc-300 py-1 pl-7 pr-1 focus:border-yellow-500 focus:ring-yellow-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 sm:text-sm"
                placeholder="
                          "
                value={date.toISOString().split("T")[0]}
                onChange={(e) => setDate(new Date(e.target.value))}
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <label htmlFor="date" className="sr-only">
                  Date
                </label>
              </div>
            </div>
          </div>
        </div>
        {/* Stats */}
        <DailyStats
          date={date}
          mealJournal={getMealJournal.data as unknown as MealJournalType}
        />
        {/* Meal Items List */}
        {getMealJournal.data?.mealItems &&
          getMealJournal.data.mealItems.length > 0 && (
            <MealItemsList
              mealItems={mealItems}
              mealJournalId={mealJournalId}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              refetch={getMealJournal.refetch}
            />
          )}
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    // If no session exists, redirect the user to the login page.
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

export default Dashboard;
