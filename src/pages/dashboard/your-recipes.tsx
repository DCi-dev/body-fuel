import type { RecipeType } from "@/types";
import { api } from "@/utils/api";
import RecipeTableItem from "@components/recipes/your-recipes/RecipeTableItem";

export default function YourRecipes() {
  const { data, isLoading, refetch } = api.recipe.getUserRecipes.useQuery();

  console.log(data);

  return (
    <>
      <main className="mx-auto mt-16  max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 lg:text-4xl">
              Your Recipes
            </h1>
            <p className="mt-2 text-base text-zinc-800 dark:text-zinc-200">
              A list of all your recipes
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 md:overflow-x-visible lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:overflow-visible">
                <table className="min-w-full divide-y divide-zinc-100 dark:divide-zinc-900">
                  <thead className="bg-zinc-300 dark:bg-zinc-800">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 sm:pl-6"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                      >
                        Category
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                      >
                        Nr. of servings
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pr-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                      >
                        Calories
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 px-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                      >
                        Shared
                      </th>

                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  {/* Table */}
                  <tbody className="relative divide-y divide-zinc-100 bg-zinc-200 dark:divide-zinc-900 dark:bg-zinc-700">
                    {!isLoading && data?.length ? (
                      data?.map((recipe) => (
                        <RecipeTableItem
                          recipe={recipe as RecipeType}
                          key={recipe.id}
                          // eslint-disable-next-line @typescript-eslint/no-misused-promises
                          refetch={refetch}
                        />
                      ))
                    ) : !isLoading && (!data || data.length === 0) ? (
                      <tr>
                        <td colSpan={6} className="py-4 text-center">
                          You do not have any recipes yet.
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td colSpan={6} className=" py-4 text-center">
                          <svg
                            aria-hidden="true"
                            className="mr-2 h-8 w-8 animate-spin fill-yellow-500 text-zinc-200 dark:text-zinc-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                          <span className="sr-only">Loading...</span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
