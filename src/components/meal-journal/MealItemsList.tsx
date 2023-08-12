/* This example requires Tailwind CSS v2.0+ */
import type { MealJournalItemType } from "@/types";
import { Menu, Transition } from "@headlessui/react";
import {
  ChevronRightIcon,
  PencilSquareIcon,
  TrashIcon,
  UserGroupIcon,
} from "@heroicons/react/20/solid";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useState } from "react";
import DeleteMealItem from "./DeleteMealItem";
import UpdateServings from "./UpdateServings";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface Props {
  mealItems?: MealJournalItemType[];
  mealJournalId?: string;
  refetch: () => void;
}

export default function MealItemsList({
  mealItems,
  mealJournalId,
  refetch,
}: Props) {
  const [isUpdateJournalModalOpen, setIsUpdateJournalModalOpen] = useState<
    boolean[]
  >(Array(mealItems?.length).fill(false));

  const [isDeleteJournalModalOpen, setIsDeleteJournalModalOpen] = useState<
    boolean[]
  >(Array(mealItems?.length).fill(false));

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
        Meal Items
      </h2>
      <div className="mt-4 bg-zinc-50 shadow dark:bg-zinc-800 sm:rounded-md">
        <ul
          role="list"
          className="divide-y divide-zinc-200 dark:divide-zinc-700"
        >
          {mealItems ? (
            mealItems?.map((item, index) => (
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
                        <Link
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
                        </Link>
                        <div className="hidden md:block">
                          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
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
                      {/* Options */}
                      <Menu
                        as="div"
                        className="relative inline-block overflow-y-visible text-left"
                      >
                        <div>
                          <Menu.Button className="inline-flex w-full justify-center rounded-md border border-zinc-300 bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                            Options
                            <ChevronRightIcon
                              className="-mr-1 ml-2 h-5 w-5"
                              aria-hidden="true"
                            />
                          </Menu.Button>
                        </div>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-50 mt-2 w-56 origin-top-right divide-y divide-zinc-100 rounded-md bg-zinc-100 shadow-lg ring-1 ring-zinc-900 ring-opacity-5 focus:outline-none dark:divide-zinc-900 dark:bg-zinc-900 dark:ring-zinc-600">
                            <div className="py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() => {
                                      setIsUpdateJournalModalOpen((prev) => {
                                        prev[index] = true;
                                        return [...prev];
                                      });
                                    }}
                                    className={classNames(
                                      active
                                        ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                                        : "text-zinc-700 dark:text-zinc-300",
                                      "group flex w-full items-center px-4 py-2 text-sm",
                                    )}
                                  >
                                    <PencilSquareIcon
                                      className="mr-3 h-5 w-5 text-zinc-600 group-hover:text-zinc-800 dark:text-zinc-400 dark:group-hover:text-zinc-300"
                                      aria-hidden="true"
                                    />
                                    Update servings
                                  </button>
                                )}
                              </Menu.Item>
                            </div>
                            <div className="py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() => {
                                      setIsDeleteJournalModalOpen((prev) => {
                                        prev[index] = true;
                                        return [...prev];
                                      });
                                    }}
                                    className={classNames(
                                      active
                                        ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                                        : "text-zinc-700 dark:text-zinc-300",
                                      "group flex w-full items-center px-4 py-2 text-sm",
                                    )}
                                  >
                                    <TrashIcon
                                      className="mr-3 h-5 w-5 text-zinc-600 group-hover:text-zinc-800 dark:text-zinc-400 dark:group-hover:text-zinc-300"
                                      aria-hidden="true"
                                    />
                                    Delete from journal
                                  </button>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                      {/* Update Servings */}
                      <UpdateServings
                        recipeName={item.recipe?.name as string}
                        journalId={mealJournalId as string}
                        itemId={item.id as string}
                        servings={item.servings as number}
                        open={isUpdateJournalModalOpen[index] || false}
                        setOpen={(open) => {
                          setIsUpdateJournalModalOpen((prev) => {
                            prev[index] = open;
                            return [...prev];
                          });
                        }}
                        calories={item.calories}
                        protein={item.protein}
                        carbs={item.carbs}
                        fat={item.fat}
                        refetch={refetch}
                      />
                      {/* Delete from journal */}
                      <DeleteMealItem
                        recipeName={item.recipe?.name as string}
                        journalId={mealJournalId as string}
                        itemId={item.id as string}
                        open={isDeleteJournalModalOpen[index] || false}
                        setOpen={(open) => {
                          setIsDeleteJournalModalOpen((prev) => {
                            prev[index] = open;
                            return [...prev];
                          });
                        }}
                        refetch={refetch}
                      />
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="col-span-1 flex flex-col divide-y divide-zinc-200 rounded-lg bg-white text-center shadow dark:divide-zinc-800 dark:bg-zinc-900">
              <div className="flex flex-1 flex-col p-8">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-zinc-100 text-zinc-600">
                    <ExclamationCircleIcon
                      className="h-6 w-6"
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <div className="mt-6 flex flex-1 flex-col">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    No items in this meal
                  </p>
                </div>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
