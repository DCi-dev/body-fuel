import { api } from "@/utils/api";

const FavoriteRecipes = () => {
  const { data, isLoading } = api.recipe.getUserFavoriteRecipes.useQuery();

  console.log(data);

  return (
    <main className="mt-16">
      <h1>Favorite Recipes</h1>
    </main>
  );
};

export default FavoriteRecipes;
