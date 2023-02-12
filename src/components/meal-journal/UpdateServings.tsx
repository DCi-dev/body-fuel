/* eslint-disable react/no-unescaped-entities */
import { api } from "@/utils/api";
import { Dialog, Transition } from "@headlessui/react";
import { CalendarIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { Fragment, useRef, useState } from "react";
import { toast } from "react-hot-toast";

interface Props {
  recipeName: string;
  journalId: string;
  itemId: string;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  refetch: () => void;
}

export default function AddMealToJournal({
  recipeName,
  journalId,
  itemId,
  servings,
  calories,
  protein,
  carbs,
  fat,
  open,
  setOpen,
  refetch,
}: Props) {
  const [selectedServings, setSelectedServings] = useState<number>(servings);

  const cancelButtonRef = useRef(null);

  //  Update meal item in journal
  const updateMealJournal = api.mealJournal.updateJournalItem.useMutation();

  const handleUpdateMealItemJournal = async () => {
    toast.loading("Updating meal...");
    try {
      const mealUpdate = {
        journalId: journalId,
        itemId: itemId,
        servings: selectedServings,
        calories: Math.round((calories / servings) * selectedServings),
        protein: Math.round((protein / servings) * selectedServings),
        fat: Math.round((fat / servings) * selectedServings),
        carbs: Math.round((carbs / servings) * selectedServings),
      };
      console.log(mealUpdate);
      await updateMealJournal.mutateAsync(mealUpdate);
      refetch();
      toast.dismiss();
      toast.success("Meal updated!");
      setOpen(false);
    } catch (error) {
      return toast.error("Something went wrong!");
    }
  };

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-zinc-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-zinc-100 px-4 pt-5 pb-4 text-left shadow-xl transition-all dark:bg-zinc-900 sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                      <CalendarIcon
                        className="h-6 w-6 text-yellow-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-zinc-900 dark:text-zinc-100"
                      >
                        Update "{recipeName}" in Your Meal Journal
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className=" text-zinc-700 dark:text-zinc-300">
                          Select number of servings
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Select date and number of servings */}
                  <div className="mt-5 grid w-full grid-cols-2 gap-4 sm:mt-6">
                    <div className="col-span-1 flex flex-col">
                      <label
                        htmlFor="servings"
                        className="flex justify-start gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300"
                      >
                        Servings
                        <UserGroupIcon
                          className="h-5 w-5 text-zinc-400 dark:text-zinc-600"
                          aria-hidden="true"
                        />
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <input
                          type="number"
                          name="servings"
                          id="servings"
                          className="block w-full rounded-md border-zinc-300 py-1 pl-7 focus:border-yellow-500 focus:ring-yellow-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 sm:text-sm"
                          value={selectedServings}
                          onChange={(e) =>
                            setSelectedServings(parseInt(e.target.value))
                          }
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center">
                          <label htmlFor="servings" className="sr-only">
                            Servings
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-yellow-600 px-4 py-2 text-base font-medium text-zinc-100 shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                      // eslint-disable-next-line @typescript-eslint/no-misused-promises
                      onClick={() => handleUpdateMealItemJournal()}
                    >
                      Update servings
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-zinc-300 bg-zinc-100 px-4 py-2 text-base font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2  focus:ring-yellow-500 focus:ring-offset-2 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 sm:col-start-1 sm:mt-0 sm:text-sm"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
