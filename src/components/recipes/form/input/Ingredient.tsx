import type { recipeSchema } from "@/types/zod-schemas";
import { useForm, type Control } from "react-hook-form";

interface ChildProps {
  index: number;
  value: any;
  remove: (index: number) => void;
  update: (index: number, value: typeof recipeSchema) => void;
  register: any;
}

export const IngredientInput = ({
  index,
  value,
  remove,
  update,
  register,
}: ChildProps) => {
  return (
    <div>
      <div className="mt-5 mb-6 md:col-span-2 md:mt-0">
        <div className="grid grid-cols-6 gap-6">
          <div className="col-span-3 sm:col-span-2">
            <label className="block text-sm font-medium text-zinc-700">
              Ingredient name
            </label>
            <input
              type="text"
              {...register(`ingredients.${index}.name`)}
              placeholder="Eggs, flour, etc."
              className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="col-span-3 sm:col-span-2">
            <div className="flex justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <span className="text-sm text-gray-500" id="email-optional">
                grams, ml, etc.
              </span>
            </div>
            <div className="mt-1">
              <input
                type="number"
                step={0.1}
                {...register(`ingredients.${index}.quantity`)}
                id="quantity"
                className="block w-full appearance-none rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="1500"
              />
            </div>
          </div>

          <div className="col-span-3 sm:col-span-2">
            <div className="flex justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Calories
              </label>
              <span className="text-sm text-gray-500" id="email-optional">
                Optional
              </span>
            </div>
            <div className="mt-1">
              <input
                type="number"
                {...register(`ingredients.${index}.calories`)}
                id="calories"
                className="block w-full appearance-none rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="100"
                aria-describedby="optional"
              />
            </div>
          </div>

          <div className="col-span-3 sm:col-span-2">
            <div className="flex justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Protein
              </label>
              <span className="text-sm text-gray-500" id="email-optional">
                Optional
              </span>
            </div>
            <div className="mt-1">
              <input
                type="number"
                {...register(`ingredients.${index}.protein`)}
                className="block w-full appearance-none rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="100"
                aria-describedby="optional"
              />
            </div>
          </div>

          <div className="col-span-3 sm:col-span-2">
            <div className="flex justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Carbohydrates
              </label>
              <span className="text-sm text-gray-500" id="email-optional">
                Optional
              </span>
            </div>
            <div className="mt-1">
              <input
                type="number"
                {...register(`ingredients.${index}.carbohydrates`)}
                className="block w-full appearance-none rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="100"
                aria-describedby="optional"
              />
            </div>
          </div>

          <div className="col-span-3 sm:col-span-2">
            <div className="flex justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Fat
              </label>
              <span className="text-sm text-gray-500" id="email-optional">
                Optional
              </span>
            </div>
            <div className="mt-1">
              <input
                type="number"
                {...register(`ingredients.${index}.fat`)}
                className="block w-full appearance-none rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="100"
                aria-describedby="optional"
              />
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => remove(index)}
          className="mt-6 rounded-md border border-zinc-300 bg-white py-2 px-4 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Remove
        </button>
      </div>
    </div>
  );
};
