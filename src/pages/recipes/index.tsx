import FeaturedRecipes from "@/components/home/FeaturedRecipes";
import RecipeCard from "@/components/recipes/RecipeCard";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/utils/api";
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/24/outline";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useState } from "react";

const RecipesPage: NextPage = () => {
  const [page, setPage] = useState(0);

  const { data, fetchNextPage } = api.recipe.getLimitedRecipes.useInfiniteQuery(
    { limit: 9 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const handleFetchNextPage = async () => {
    await fetchNextPage();
    setPage((prev) => prev + 1);
  };

  const handleFetchPreviousPage = () => {
    setPage((prev) => prev - 1);
  };

  // data will be split in pages
  const toShow = data?.pages[page]?.recipesWithDetails;

  return (
    <>
      <Head>
        <title>Body Fuel - Recipes</title>
        <meta name="description" content="Healthy Lifestyle" />
      </Head>
      <main className=" bg-zinc-200 dark:bg-zinc-800">
        <FeaturedRecipes />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 xl:px-0">
          <div>
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
                Explore
              </h2>
            </div>
            <div className="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
              {toShow?.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  name={recipe.name}
                  description={recipe.description}
                  category={
                    recipe.category as
                      | "Breakfast"
                      | "Salads"
                      | "MainCourse"
                      | "Sides"
                      | "Snacks"
                      | "Desserts"
                      | "Drinks"
                      | "SaucesAndDressings"
                  }
                  imageSrc={recipe.image as string}
                  slug={recipe.slug}
                  userName={recipe.user?.name as string}
                  userImage={recipe.user?.image as string}
                />
              ))}
            </div>
          </div>
          {/* Pagination */}
          <div className=" mt-16 flex items-center justify-between border-t border-zinc-200 px-4 sm:px-0">
            <div className="-mt-px flex w-0 flex-1">
              <button
                onClick={handleFetchPreviousPage}
                disabled={page === 0}
                className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-zinc-500 hover:border-zinc-300 hover:text-zinc-700"
              >
                <ArrowLongLeftIcon
                  className="mr-3 h-5 w-5 text-zinc-400"
                  aria-hidden="true"
                />
                Previous
              </button>
            </div>
            <div className="-mt-px flex w-0 flex-1 justify-end">
              <button
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={handleFetchNextPage}
                disabled={data?.pages.length === page + 1}
                className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-zinc-500 hover:border-zinc-300 hover:text-zinc-700"
              >
                Next
                <ArrowLongRightIcon
                  className="ml-3 h-5 w-5 text-zinc-400"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (session) {
    // If no session exists, redirect the user to the login page.
    return {
      redirect: {
        destination: "/dashboard/recipes",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

export default RecipesPage;
