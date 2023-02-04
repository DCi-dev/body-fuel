import RecipePageHero from "@/components/recipes/recipe/Hero";
import Ingredients from "@/components/recipes/recipe/Ingredients";
import Instructions from "@/components/recipes/recipe/Instructions";
import type { Ingredient, Instruction } from "@/types";
import { api } from "@/utils/api";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";

interface Props {
  slug: string;
}

interface Recipe {
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

const Recipe = ({ slug }: Props) => {
  const { data, isLoading } = api.recipe.getRecipe.useQuery(slug);

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

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
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
      </div>
    );
  }
  return (
    <>
      <Head>
        <title>Body Fuel = Recipes</title>
        <meta name="description" content="Healthy Lifestyle" />
      </Head>
      <main className="mt-16">
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
        />
        <Ingredients
          ingredients={recipe?.ingredients}
          originalServings={recipe?.servings}
          selectedServings={selectedServings}
        />
        <Instructions instructions={recipe?.instructions} />
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { slug } = ctx.params as { slug: string };
  return Promise.resolve({
    props: {
      slug,
    },
  });
};
export default Recipe;
