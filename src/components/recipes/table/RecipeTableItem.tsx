import type { RecipeType } from "@/types";
import { api } from "@/utils/api";
import { Menu, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  HeartIcon,
  PencilSquareIcon,
  ShareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type Props = {
  recipe: RecipeType;
  refetch: () => void;
  userId: string;
  favoriteRecipeIds?: string[];
};

const RecipeTableItem = ({
  recipe,
  refetch,
  userId,
  favoriteRecipeIds,
}: Props) => {
  // Favorite recipes
  const addToFavorites = api.user.addRecipeToFavorites.useMutation();
  const removeFromFavorites = api.user.removeRecipeFromFavorites.useMutation();

  const [isFavoriteRecipe, setIsFavoriteRecipe] = useState<boolean>(false);

  useEffect(() => {
    if (favoriteRecipeIds?.includes(recipe.id)) {
      setIsFavoriteRecipe(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favoriteRecipeIds, recipe.id]);

  const handleAddToFavorites = async () => {
    await addToFavorites.mutateAsync(recipe.id);
    setIsFavoriteRecipe(true);
  };

  const handleRemoveFromFavorites = async () => {
    await removeFromFavorites.mutateAsync(recipe.id);
    setIsFavoriteRecipe(false);
  };

  const handleClick = async () => {
    if (isFavoriteRecipe) {
      await handleRemoveFromFavorites();
    } else {
      await handleAddToFavorites();
    }
    refetch();
  };

  // Share recipes
  const updateShare = api.recipe.updateSharedRecipe.useMutation();

  const handleShare = async () => {
    await updateShare.mutateAsync({
      id: recipe.id,
      shared: !recipe.shared,
    });
    refetch();
  };

  // Delete recipes
  const deleteRecipe = api.recipe.deleteRecipe.useMutation();

  const handleDelete = async () => {
    await deleteRecipe.mutateAsync(recipe.id);
    refetch();
  };

  return (
    <tr className="w-full text-zinc-900 dark:text-zinc-100" key={recipe.id}>
      <td className="whitespace-normal py-4 pl-4 pr-5 lg:whitespace-nowrap">
        <div className="flex flex-col items-center sm:flex-row">
          <div className="h-16 w-16 flex-shrink-0">
            <Image
              src={recipe.image}
              style={{ width: "100%", height: "100%" }} // layout="responsive" prior to Next 13.0.0
              alt={recipe.name}
              className="object-cover object-center"
              width={64}
              height={64}
            />
          </div>
          <div className="overflow-wrap ml-4">
            <Link href={`/recipes/${recipe.slug}`}>
              <div className=" font-bold text-zinc-900 dark:text-zinc-100">
                {recipe.name}
              </div>
            </Link>
          </div>
        </div>
      </td>
      <td className="whitespace-normal px-3 py-4 lg:whitespace-nowrap">
        <div className=" text-zinc-900 dark:text-zinc-100">
          {recipe.category[0]?.name}
        </div>
      </td>
      <td className="hidden whitespace-nowrap px-3 py-4 lg:table-cell">
        <span className="inline-flex px-2  leading-5 text-zinc-800 dark:text-zinc-200">
          {recipe.servings}
        </span>
      </td>
      <td className="hidden whitespace-nowrap py-4 pr-3 lg:table-cell">
        <span className="inline-flex rounded-full  px-2  leading-5 text-zinc-800 dark:text-zinc-200">
          {recipe.calories}
        </span>
      </td>
      <td className="relative whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
        {/* Options */}
        <Menu
          as="div"
          className="relative inline-block overflow-y-visible text-left"
        >
          <div>
            <Menu.Button className="inline-flex w-full justify-center rounded-md border border-zinc-300 bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              Options
              <ChevronDownIcon
                className="-mr-1 ml-2 h-5 w-5"
                aria-hidden="true"
              />
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-50 mt-2 w-56 origin-top-right divide-y divide-zinc-100 rounded-md bg-zinc-100 shadow-lg ring-1 ring-zinc-900 ring-opacity-5 focus:outline-none dark:divide-zinc-900 dark:bg-zinc-900 dark:ring-zinc-600">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="#"
                      className={classNames(
                        active
                          ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                          : "text-zinc-700 dark:text-zinc-300",
                        "group  flex items-center px-4 py-2 text-sm"
                      )}
                    >
                      <PencilSquareIcon
                        className="mr-3 h-5 w-5 text-zinc-600 group-hover:text-zinc-800 dark:text-zinc-400 dark:group-hover:text-zinc-300"
                        aria-hidden="true"
                      />
                      Edit
                    </Link>
                  )}
                </Menu.Item>
              </div>
              {userId === recipe.userId && (
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        onClick={handleShare}
                        className={classNames(
                          active
                            ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                            : "text-zinc-700 dark:text-zinc-300",
                          "group flex w-full items-center px-4 py-2 text-sm"
                        )}
                      >
                        <ShareIcon
                          className="mr-3 h-5 w-5 text-zinc-600 group-hover:text-zinc-800 dark:text-zinc-400 dark:group-hover:text-zinc-300"
                          aria-hidden="true"
                        />
                        {recipe.shared ? "Unshare" : "Share"}
                      </button>
                    )}
                  </Menu.Item>
                </div>
              )}
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      // eslint-disable-next-line @typescript-eslint/no-misused-promises
                      onClick={handleClick}
                      className={classNames(
                        active
                          ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                          : "text-zinc-700 dark:text-zinc-300",
                        "group flex w-full items-center px-4 py-2 text-sm"
                      )}
                    >
                      <HeartIcon
                        className={`mr-3 h-5 w-5 fill-current ${
                          isFavoriteRecipe
                            ? "text-yellow-500"
                            : "text-neutral-500"
                        }`}
                        aria-hidden="true"
                      />
                      {isFavoriteRecipe
                        ? "Remove from favorites"
                        : "Add to favorites"}
                    </button>
                  )}
                </Menu.Item>
              </div>
              {userId === recipe.userId && (
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        onClick={handleDelete}
                        className={classNames(
                          active
                            ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                            : "text-zinc-700 dark:text-zinc-300",
                          "group flex w-full items-center px-4 py-2 text-sm"
                        )}
                      >
                        <TrashIcon
                          className="mr-3 h-5 w-5 text-zinc-600 group-hover:text-zinc-800 dark:text-zinc-400 dark:group-hover:text-zinc-300"
                          aria-hidden="true"
                        />
                        Delete
                      </button>
                    )}
                  </Menu.Item>
                </div>
              )}
            </Menu.Items>
          </Transition>
        </Menu>
      </td>
    </tr>
  );
};

export default RecipeTableItem;
