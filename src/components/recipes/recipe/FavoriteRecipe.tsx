import { api } from "@/utils/api";
import {
  HeartIcon,
} from "@heroicons/react/24/outline";

import { useEffect, useState } from "react";



interface Props {
  id: string;
}

export default function FavoriteRecipe({
  id,
}: Props) {
  const favoriteRecipe = api.recipe.getUserFavoriteRecipe.useQuery(id);
  const addToFavorites = api.user.addRecipeToFavorites.useMutation();
  const removeFromFavorites = api.user.removeRecipeFromFavorites.useMutation();

  const [isFavoriteRecipe, setIsFavoriteRecipe] = useState<boolean>(false);

  const favoriteClass = `h-8 w-8 fill-current ${
    isFavoriteRecipe ? "text-yellow-500" : "text-zinc-500"
  }`;

  const invalidateFavorites = async () => {
    await favoriteRecipe.refetch();
  };

  useEffect(() => {
    void invalidateFavorites();

    if (favoriteRecipe.data) {
      setIsFavoriteRecipe(true);
    } else {
      setIsFavoriteRecipe(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favoriteRecipe.data]);

  const handleAddToFavorites = async () => {
    await addToFavorites.mutateAsync(id);
    setIsFavoriteRecipe(true);
  };

  const handleRemoveFromFavorites = async () => {
    await removeFromFavorites.mutateAsync(id);
    setIsFavoriteRecipe(false);
  };

  const handleClick = async () => {
    if (isFavoriteRecipe) {
      await handleRemoveFromFavorites();
    } else {
      await handleAddToFavorites();
    }
  };

  return (

                <button
                  className="col-span-1 flex flex-row items-center justify-start gap-2 rounded-full p-2"
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onClick={() => handleClick()}
                >
                  <HeartIcon className={favoriteClass} />{" "}
                  <span>
                    {!isFavoriteRecipe
                      ? "Add to favorites"
                      : "Remove from favorites"}
                  </span>
                </button>
           
  );
}
