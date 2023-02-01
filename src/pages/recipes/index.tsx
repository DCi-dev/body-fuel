import RecipeCard from "@/components/recipes/RecipeCard";
import { api } from "@/utils/api";
import type { NextPage } from "next";
import Head from "next/head";

const RecipesPage: NextPage = () => {
  const getRecipes = api.recipe.getRecipes.useQuery();

  console.log(getRecipes.data);

  // name, description, category[0].name, image, 

  return (
    <>
      <Head>
        <title>Body Fuel = Recipes</title>
        <meta name="description" content="Healthy Lifestyle" />
      </Head>
      <main className="mt-28">
        <div>
          {getRecipes.data?.map((recipe) => (
            <RecipeCard key={recipe.id} name={recipe.name} description={recipe.description} category={recipe.category[0]?.name as string} imageSrc={recipe.image as string} slug={recipe.slug}/>
          ))
          }
        </div>
      </main>
    </>
  );
};

export default RecipesPage;
