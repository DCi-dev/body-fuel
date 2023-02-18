/* eslint-disable react/no-unescaped-entities */
import { api } from "@/utils/api";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Fragment, useRef } from "react";
import { toast } from "react-hot-toast";

interface Props {
  recipeName: string;
  journalId: string;
  itemId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  refetch: () => void;
}

export default function DeleteMealItem({
  recipeName,
  journalId,
  itemId,
  open,
  setOpen,
  refetch,
}: Props) {
  const cancelButtonRef = useRef(null);

  //  Delete meal item from journal
  const deleteMealJournal = api.mealJournal.deleteJournalItem.useMutation();

  const handleDeleteMealItemJournal = async () => {
    toast.loading("Deleting meal...");
    try {
      const mealDelete = {
        journalId: journalId,
        itemId: itemId,
      };
      await deleteMealJournal.mutateAsync(mealDelete);
      refetch();
      toast.dismiss();
      toast.success("Meal deleted!");
      setOpen(false);
    } catch (error) {
      toast.dismiss();
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
                    onClose={() => setOpen(!open)}

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
            <div className="fixed inset-0 bg-zinc-400 bg-opacity-75 transition-opacity dark:bg-zinc-800 dark:bg-opacity-75" />
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
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                      <ExclamationTriangleIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-zinc-900 dark:text-zinc-100"
                      >
                        Remove "{recipeName}" from Your Meal Journal
                      </Dialog.Title>
                      <div className="mt-2 mb-8">
                        <p className=" text-zinc-700 dark:text-zinc-300">
                          Are you sure you want to remove this meal from your
                          journal? This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 mb-3 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-zinc-100 shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                      // eslint-disable-next-line @typescript-eslint/no-misused-promises
                      onClick={() => handleDeleteMealItemJournal()}
                    >
                      Remove
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
