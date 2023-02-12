/* This example requires Tailwind CSS v2.0+ */
import type { MealJournalItemType } from "@/types";
import { ChevronRightIcon, UserGroupIcon } from "@heroicons/react/20/solid";
import Image from "next/image";

interface Props {
  mealItems?: MealJournalItemType[];
}

export default function MealItemsList({ mealItems }: Props) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
        Meal Items
      </h2>
      <div className="mt-4 overflow-hidden bg-zinc-50 shadow dark:bg-zinc-800 sm:rounded-md">
        <ul
          role="list"
          className="divide-y divide-zinc-200 dark:divide-zinc-700"
        >
          {mealItems?.map((item) => (
            <li key={item.id}>
              <div className="block hover:bg-zinc-200 dark:hover:bg-zinc-700">
                <div className="flex items-center px-4 py-4 sm:px-6">
                  <div className="flex min-w-0 flex-1 items-center">
                    <div className="flex-shrink-0">
                      <Image
                        className="h-20 w-20 rounded-xl"
                        src={item.recipe?.image as string}
                        alt={item.recipe?.name as string}
                        width={80}
                        height={80}
                      />
                    </div>
                    <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                      <a
                        href={`/recipes/${item.recipe?.slug as string}`}
                        className="block "
                      >
                        <p className="text-lg font-medium text-yellow-600 dark:text-yellow-400">
                          {item.recipe?.name as string}
                        </p>
                        <p className="mt-2 flex items-center text-zinc-700 dark:text-zinc-300">
                          <UserGroupIcon
                            className="mr-1.5 h-5 w-5 flex-shrink-0 text-zinc-600 dark:text-zinc-400"
                            aria-hidden="true"
                          />
                          <span>Number of servings: {item.servings}</span>
                        </p>
                      </a>
                      <div className="hidden md:block">
                        <div>
                          <p className=" text-zinc-900 dark:text-zinc-100">
                            Calories: {item.calories}
                          </p>
                          <p className=" text-zinc-900 dark:text-zinc-100">
                            Protein: {item.protein}
                          </p>
                          <p className=" text-zinc-900 dark:text-zinc-100">
                            Carbs: {item.carbs}
                          </p>
                          <p className=" text-zinc-900 dark:text-zinc-100">
                            Fat: {item.fat}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <ChevronRightIcon
                      className="h-5 w-5 text-zinc-400"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
