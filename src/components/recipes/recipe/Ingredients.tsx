import type { Ingredient } from "@/types";

export default function Ingredients({
  ingredients,
}: {
  ingredients: Ingredient[];
}) {
  return (
    <div className="bg-zinc-100 px-4 pt-6 dark:bg-zinc-900 sm:px-6  lg:px-8">
      <div className="sm:flex sm:items-center lg:mx-auto lg:max-w-7xl">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
            Ingredients
          </h1>
          <p className="my-3 text-xl text-zinc-700 dark:text-zinc-300 sm:mt-4">
            Here are the ingredients you need to make this recipe.
          </p>
        </div>
      </div>
      <div className="mt-8 flex flex-col lg:mx-auto lg:max-w-7xl">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-zinc-300 dark:divide-zinc-700">
                <thead className="bg-zinc-50 dark:bg-zinc-800">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 sm:pl-6"
                    >
                      Name and Quantity
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                    >
                      Calories
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                    >
                      Protein
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                    >
                      Carbs
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                    >
                      Fat
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-zinc-700">
                  {ingredients.map((ingredient, index) => (
                    <tr
                      key={ingredient.id}
                      className={
                        index % 2 === 0
                          ? undefined
                          : "bg-zinc-50 dark:bg-zinc-600"
                      }
                    >
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-zinc-900 dark:text-zinc-100 sm:pl-6">
                        {ingredient.quantity} {ingredient.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-600 dark:text-zinc-300">
                        {ingredient.calories ? ingredient.calories : "*"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-600 dark:text-zinc-300">
                        {ingredient.protein ? ingredient.protein : "*"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-600 dark:text-zinc-300">
                        {ingredient.carbohydrates
                          ? ingredient.carbohydrates
                          : "*"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-600 dark:text-zinc-300">
                        {ingredient.fat ? ingredient.fat : "*"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
