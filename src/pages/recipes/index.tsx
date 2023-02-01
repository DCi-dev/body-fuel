import RecipeCard from "@/components/recipes/RecipeCard";
import { api } from "@/utils/api";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";

const RecipesPage: NextPage = () => {
  const [page, setPage] = useState(0);

  const { data, fetchNextPage } = api.recipe.getLimitedRecipes.useInfiniteQuery(
    { limit: 2 },
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
        <title>Body Fuel = Recipes</title>
        <meta name="description" content="Healthy Lifestyle" />
      </Head>
      <main className="mt-28">
        <div className="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
          {toShow?.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              name={recipe.name}
              description={recipe.description}
              category={recipe.category[0]?.name as string}
              imageSrc={recipe.image as string}
              slug={recipe.slug}
              userName={recipe.user?.name as string}
              userImage={recipe.user?.image as string}
            />
          ))}
        </div>
      </main>
    </>
  );
};

export default RecipesPage;
