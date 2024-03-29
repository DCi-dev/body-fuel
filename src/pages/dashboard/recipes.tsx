import RecipesTable from "@/components/recipes/table/RecipesTable";
import { getServerAuthSession } from "@/server/auth";
import type { RecipeType } from "@/types";
import { api } from "@/utils/api";
import { Tab } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import type { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { Fragment, useState } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const SessionRecipes = () => {
  const { data: sessionData } = useSession();

  const [search, setSearch] = useState("");
  const [userPage, setUserPage] = useState(0);
  const [favPage, setFavPage] = useState(0);
  const [allPage, setAllPage] = useState(0);

  // User recipes
  const yourRecipes = api.recipe.getUserLimitedRecipes.useInfiniteQuery(
    { limit: 5, search: search },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  // Favorite recipes
  const favoriteRecipesIds = api.recipe.getUserFavoriteRecipesIds.useQuery();

  const favoriteRecipes =
    api.recipe.getLimitedUserFavoriteRecipes.useInfiniteQuery(
      { limit: 5, search: search },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );
  //  All recipes
  const allRecipes = api.recipe.getLimitedRecipes.useInfiniteQuery(
    { limit: 5, search: search },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  return (
    <>
      <Head>
        <title>Body Fuel - Recipes Dashboard</title>
        <meta name="description" content="Healthy Lifestyle" />
      </Head>
      <div className=" min-h-screen  bg-zinc-100 px-4 dark:bg-zinc-900 md:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between py-8">
          <h1 className="mr-4 text-2xl md:mr-2 lg:mr-0 lg:text-3xl">Recipes</h1>
          <div className="flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="w-full max-w-lg lg:max-w-xs">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon
                    className="h-5 w-5 text-zinc-600 dark:text-zinc-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full rounded-md border border-zinc-300 bg-zinc-50 py-2 pl-10 pr-3 leading-5 placeholder-zinc-600 focus:border-yellow-500 focus:placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-yellow-500 dark:border-zinc-700 dark:bg-zinc-800 dark:placeholder-zinc-400 dark:focus:placeholder-zinc-600 sm:text-sm"
                  placeholder="Search"
                  type="search"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Views */}
        <Tab.Group>
          <Tab.List className="isolate mx-auto flex max-w-7xl divide-x divide-zinc-200 rounded-lg shadow dark:divide-zinc-700">
            <Tab as={Fragment}>
              {({ selected }) => (
                <button
                  className={classNames(
                    selected
                      ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-50"
                      : "bg-zinc-300 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-600 dark:hover:text-zinc-300",
                    "group relative block w-full min-w-0 flex-1 overflow-hidden rounded-l-lg  px-4 py-4 text-center text-sm font-medium",
                  )}
                >
                  Your Recipes
                </button>
              )}
            </Tab>
            <Tab as={Fragment}>
              {({ selected }) => (
                <button
                  className={classNames(
                    selected
                      ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-50"
                      : "bg-zinc-300 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-600 dark:hover:text-zinc-300",
                    "group relative block w-full min-w-0 flex-1 overflow-hidden px-4 py-4 text-center text-sm font-medium",
                  )}
                >
                  Favorites
                </button>
              )}
            </Tab>
            <Tab as={Fragment}>
              {({ selected }) => (
                <button
                  className={classNames(
                    selected
                      ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-50"
                      : "bg-zinc-300 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-600 dark:hover:text-zinc-300",
                    "group relative block w-full min-w-0 flex-1 overflow-hidden rounded-r-lg  px-4 py-4 text-center text-sm font-medium",
                  )}
                >
                  All Recipes
                </button>
              )}
            </Tab>
          </Tab.List>
          <Tab.Panels className={"mx-auto mt-8 max-w-7xl"}>
            <Tab.Panel>
              <RecipesTable
                recipes={
                  yourRecipes.data?.pages[userPage]
                    ?.recipesWithDetails as RecipeType[]
                }
                isLoading={yourRecipes.isLoading}
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                userId={sessionData?.user?.id as string}
                favoriteRecipesIds={favoriteRecipesIds.data as string[]}
                refetchYourRecipes={
                  yourRecipes.refetch as unknown as () => Promise<void>
                }
                refetchFav={
                  favoriteRecipes.refetch as unknown as () => Promise<void>
                }
                refetchFavIds={
                  favoriteRecipesIds.refetch as unknown as () => Promise<void>
                }
                refetchAllRecipes={
                  allRecipes.refetch as unknown as () => Promise<void>
                }
                page={userPage}
                setPage={setUserPage}
                fetchNextPage={yourRecipes.fetchNextPage}
                pageLength={yourRecipes.data?.pages.length}
              />
            </Tab.Panel>
            <Tab.Panel>
              <RecipesTable
                recipes={
                  favoriteRecipes.data?.pages[favPage]
                    ?.recipesWithDetails as RecipeType[]
                }
                isLoading={favoriteRecipes.isLoading}
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                userId={sessionData?.user?.id as string}
                favoriteRecipesIds={favoriteRecipesIds.data as string[]}
                refetchYourRecipes={
                  yourRecipes.refetch as unknown as () => Promise<void>
                }
                refetchFav={
                  favoriteRecipes.refetch as unknown as () => Promise<void>
                }
                refetchFavIds={
                  favoriteRecipesIds.refetch as unknown as () => Promise<void>
                }
                refetchAllRecipes={
                  allRecipes.refetch as unknown as () => Promise<void>
                }
                page={favPage}
                setPage={setFavPage}
                fetchNextPage={favoriteRecipes.fetchNextPage}
                pageLength={favoriteRecipes.data?.pages.length}
              />
            </Tab.Panel>
            <Tab.Panel>
              <RecipesTable
                recipes={
                  allRecipes.data?.pages[allPage]
                    ?.recipesWithDetails as RecipeType[]
                }
                isLoading={allRecipes.isLoading}
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                userId={sessionData?.user?.id as string}
                favoriteRecipesIds={favoriteRecipesIds.data as string[]}
                refetchYourRecipes={
                  yourRecipes.refetch as unknown as () => Promise<void>
                }
                refetchFav={
                  favoriteRecipes.refetch as unknown as () => Promise<void>
                }
                refetchFavIds={
                  favoriteRecipesIds.refetch as unknown as () => Promise<void>
                }
                refetchAllRecipes={
                  allRecipes.refetch as unknown as () => Promise<void>
                }
                page={allPage}
                setPage={setAllPage}
                fetchNextPage={allRecipes.fetchNextPage}
                pageLength={allRecipes.data?.pages.length}
              />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
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

export default SessionRecipes;
