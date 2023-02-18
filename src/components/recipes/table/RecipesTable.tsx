import type { RecipeType } from "@/types/index";
import type {
  FetchNextPageOptions,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import RecipeTableItem from "./RecipeTableItem";

interface Props {
  recipes: RecipeType[];
  isLoading: boolean;
  refetchYourRecipes: () => Promise<void>;
  refetchFav: () => Promise<void>;
  refetchFavIds: () => Promise<void>;
  refetchAllRecipes: () => Promise<void>;
  userId: string;
  favoriteRecipesIds?: string[];
  page: number;
  setPage: (page: number) => void;
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<UseInfiniteQueryResult>;
  pageLength?: number;
}

export default function RecipesTable({
  recipes,
  isLoading,
  refetchFav,
  refetchFavIds,
  refetchYourRecipes,
  refetchAllRecipes,
  userId,
  favoriteRecipesIds,
  page,
  setPage,
  fetchNextPage,
  pageLength,
}: Props) {
  const handleFetchNextPage = async () => {
    await fetchNextPage();
    setPage(page + 1);
  };

  const handleFetchPreviousPage = () => {
    setPage(page - 1);
  };
  return (
    <div className="mx-auto max-w-full md:px-8 ">
      <div className="flex flex-col">
        <div className="-my-2  overflow-x-visible sm:-mx-6 lg:-mx-8 ">
          <div className="inline-block min-w-full py-2 align-middle ">
            <div className="overflow-visible shadow ring-1 ring-black ring-opacity-5">
              <table className="min-w-full divide-y divide-zinc-100  dark:divide-zinc-900">
                <thead className="bg-zinc-300 dark:bg-zinc-800">
                  <tr>
                    <th
                      scope="col"
                      className=" py-3.5 pl-4 pr-5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 sm:pl-6"
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
                      className="hidden py-3.5 pl-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 lg:table-cell"
                    >
                      Nr. of servings
                    </th>
                    <th
                      scope="col"
                      className="hidden py-3.5 pr-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 lg:table-cell"
                    >
                      Calories
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
                  {!isLoading && recipes?.length ? (
                    recipes?.map((recipe) => (
                      <RecipeTableItem
                        recipe={recipe}
                        key={recipe.id}
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        refetchFav={refetchFav}
                        refetchFavIds={refetchFavIds}
                        userId={userId}
                        favoriteRecipesIds={favoriteRecipesIds}
                        refetchYour={refetchYourRecipes}
                        refetchAll={refetchAllRecipes}
                      />
                    ))
                  ) : !isLoading && (!recipes || recipes.length === 0) ? (
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
            {!isLoading && recipes.length > 5 ? (
              <div className="min-w-full">
                <div className="flex w-full justify-between py-4 text-center">
                  <button
                    type="button"
                    disabled={page === 0}
                    className="inline-flex items-center rounded-md border border-transparent bg-zinc-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-600 "
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    onClick={handleFetchPreviousPage}
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    disabled={pageLength === page + 1}
                    className="inline-flex items-center rounded-md border border-transparent bg-zinc-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-600 "
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    onClick={handleFetchNextPage}
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
