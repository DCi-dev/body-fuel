import RecipePageHero from "@/components/recipes/recipe/Hero";
import Ingredients from "@/components/recipes/recipe/Ingredients";
import Instructions from "@/components/recipes/recipe/Instructions";
import LeaveAReview from "@/components/recipes/recipe/LeaveAReview";
import Reviews from "@/components/recipes/recipe/Reviews";
import type { Ingredient, Instruction, Review } from "@/types";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useState } from "react";

interface PageProps {
  slug: string;
}

interface Recipe {
  reviewWithUserDetails: Review[];
  id: string;
  name: string;
  description: string;
  category: {
    name: string;
  }[];
  image: string;
  user: {
    name: string;
    image: string;
  };
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  servings: number;
  prepTime: string;
  cookTime: string;
  difficulty: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
}

const RecipePage: NextPage<PageProps> = ({ slug }) => {
  const { data: sessionData } = useSession();

  const { data, refetch } = api.recipe.getRecipe.useQuery({slug: slug});

  const recipe = data as unknown as Recipe;

  const [selectedServings, setSelectedServings] = useState<number>(0);

  useEffect(() => {
    setSelectedServings(recipe?.servings);
  }, [recipe?.servings]);

  // Calculate the nutrition facts for the selected servings
  const calories = Math.round(
    (recipe?.calories / recipe?.servings) * selectedServings
  );
  const protein = Math.round(
    (recipe?.protein / recipe?.servings) * selectedServings
  );
  const fat = Math.round((recipe?.fat / recipe?.servings) * selectedServings);
  const carbs = Math.round(
    (recipe?.carbohydrates / recipe?.servings) * selectedServings
  );

  // Calculate the average stars for the recipe reviews
  const averageStars =
    recipe?.reviewWithUserDetails.reduce((acc, curr) => acc + curr.stars, 0) /
    recipe?.reviewWithUserDetails.length;

  return (
    <>
      <Head>
        <title>Body Fuel = Recipes</title>
        <meta name="description" content="Healthy Lifestyle" />
      </Head>
        <main className="max-w-screen overflow-hidden bg-zinc-100 dark:bg-zinc-900 md:px-4">
          <RecipePageHero
            id={recipe?.id}
            name={recipe?.name}
            description={recipe?.description}
            category={recipe?.category[0]?.name}
            imageSrc={recipe?.image}
            userName={recipe?.user?.name}
            userImage={recipe?.user?.image}
            calories={calories}
            protein={protein}
            fat={fat}
            carbs={carbs}
            servings={selectedServings}
            setServings={setSelectedServings}
            prepTime={recipe?.prepTime}
            cookTime={recipe?.cookTime}
            difficulty={recipe?.difficulty}
            averageStars={averageStars}
          />
          <Ingredients
            ingredients={recipe?.ingredients}
            originalServings={recipe?.servings}
            selectedServings={selectedServings}
          />
          <Instructions instructions={recipe?.instructions} />
          <div className="bg-zinc-100 pb-16 text-center dark:bg-zinc-900">
            <h2 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-zinc-100 lg:text-4xl">
              Reviews
            </h2>
            {sessionData?.user ? (
              <LeaveAReview
                recipeId={recipe?.id}
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                refetch={refetch}
              />
            ) : (
              <p className="text-xl font-bold text-zinc-700 dark:text-zinc-300 lg:text-2xl">
                Please sign in to leave a review
              </p>
            )}
            <Reviews reviews={recipe?.reviewWithUserDetails} />
          </div>
        </main>
    </>
  );
};

import { appRouter } from "@/server/api/root";
import { prisma } from "@/server/db";
import { createServerSideHelpers } from "@trpc/react-query/server";
import type { GetStaticPaths, GetStaticPropsContext, NextPage } from "next";
import superjson from "superjson";

export async function getStaticProps(
  context: GetStaticPropsContext<{ slug: string }>
) {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, session: null },
    transformer: superjson,
  });

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("No slug provided");

  await ssg.recipe.getRecipe.prefetch({ slug: slug });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      slug,
    },
    revalidate: 1,
  };
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default RecipePage;
