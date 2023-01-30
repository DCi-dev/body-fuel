import { recipeSchema } from "@/types/zod-schemas";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import type { Control, UseFormProps } from "react-hook-form";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import type { z } from "zod";
import { IngredientInput } from "./input/Ingredient";

function useZodForm<TSchema extends z.ZodType>(
  props: Omit<UseFormProps<TSchema["_input"]>, "resolver"> & {
    schema: TSchema;
  }
) {
  const form = useForm<TSchema["_input"]>({
    ...props,
    resolver: zodResolver(props.schema, undefined),
  });

  return form;
}

export default function CreateRecipeForm() {
  const methods = useZodForm({
    schema: recipeSchema,
  });

  const { fields, append, remove, update } = useFieldArray({
    control: methods.control, // control props comes from useForm (optional: if you are using FormContext)
    name: "ingredients", // unique name for your Field Array
  });

  const createRecipe = api.recipe.createRecipe.useMutation();

  // Image
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImage(e.target.files?.[0] || null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setImage(e.dataTransfer.files[0] || null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onSubmit = (data) => console.log(data);

  return (
    <FormProvider {...methods}>
      <form className="space-y-6" onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-zinc-900">
                RecipeDetails
              </h3>
              <p className="mt-1 text-sm text-zinc-500">WW</p>
            </div>
            <div className="mt-5 space-y-6 md:col-span-2 md:mt-0">
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-3 sm:col-span-1">
                  <label className="block text-sm font-medium text-zinc-700">
                    Recipe Name
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      {...methods.register("name")}
                      className="block w-full flex-1 rounded-none rounded-r-md border-zinc-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Parmesan Crusted Chicken"
                    />
                  </div>
                </div>
                <div className="col-span-3 sm:col-span-1">
                  <label className="block text-sm font-medium text-zinc-700">
                    Category
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      {...methods.register("category")}
                      className="block w-full flex-1 rounded-none rounded-r-md border-zinc-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Breakfast"
                    />
                  </div>
                </div>
                <div className="col-span-3 sm:col-span-1">
                  <div className="flex justify-between">
                    <label className="block text-sm font-medium text-zinc-700">
                      Difficulty
                    </label>
                    <span className="text-sm text-gray-500" id="email-optional">
                      Optional
                    </span>
                  </div>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      {...methods.register("difficulty")}
                      className="block w-full flex-1 rounded-none rounded-r-md border-zinc-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Breakfast"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-3 sm:col-span-1">
                  <label className="block text-sm font-medium text-zinc-700">
                    Number of servings
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="number"
                      name="servings"
                      className="block w-full flex-1 rounded-none rounded-r-md border-zinc-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      defaultValue={1}
                    />
                  </div>
                </div>
                <div className="col-span-3 sm:col-span-1">
                  <div className="flex justify-between">
                    <label className="block text-sm font-medium text-zinc-700">
                      Prep time
                    </label>
                    <span className="text-sm text-gray-500" id="email-optional">
                      Optional
                    </span>
                  </div>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      {...methods.register("prepTime")}
                      className="block w-full flex-1 rounded-none rounded-r-md border-zinc-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="12 minutes"
                    />
                  </div>
                </div>
                <div className="col-span-3 sm:col-span-1">
                  <div className="flex justify-between">
                    <label className="block text-sm font-medium text-zinc-700">
                      Cook time
                    </label>
                    <span className="text-sm text-gray-500" id="email-optional">
                      Optional
                    </span>
                  </div>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      {...methods.register("cookTime")}
                      className="block w-full flex-1 rounded-none rounded-r-md border-zinc-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="half an hour"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700">
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    {...methods.register("description")}
                    rows={3}
                    className="block w-full rounded-md border-zinc-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="This is a simple and crispy oven baked chicken."
                    defaultValue={""}
                  />
                </div>
                <p className="mt-2 text-sm text-zinc-500">
                  Brief description for your recipe.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700">
                  Recipe Image
                </label>
                <div
                  className="mt-1 flex justify-center rounded-md border-2 border-dashed border-zinc-300 px-6 pt-5 pb-6"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <div className="space-y-1 overflow-hidden text-center">
                    {image ? (
                      <div className="grid items-center justify-center md:grid-cols-2">
                        <Image
                          src={URL.createObjectURL(image)}
                          alt="Preview"
                          width={1000}
                          height={500}
                          className="max-h-52 w-auto"
                        />
                        <label className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500">
                          <span>Change image</span>
                          <input
                            className="sr-only"
                            type="file"
                            name="image"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>
                    ) : (
                      <>
                        <svg
                          className="mx-auto h-12 w-12 text-zinc-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-zinc-600">
                          <label className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500">
                            <span>Upload a image</span>
                            <input
                              name="image"
                              type="file"
                              className="sr-only"
                              onChange={handleImageChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-zinc-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-zinc-900">
                Ingredients
              </h3>
              <p className="mt-1 text-sm text-zinc-500">
                What ingredients do you need for this recipe?
              </p>
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              {fields.map((field, index) => (
                <IngredientInput
                  key={field.id}
                  update={
                    update as unknown as (
                      index: number,
                      value: typeof recipeSchema
                    ) => void
                  }
                  index={index}
                  register={methods.register}
                  remove={remove as (index: number) => void}
                  value={field}
                />
              ))}
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    append({
                      name: "",
                      quantity: 0,
                      calories: 0,
                      protein: 0,
                      carbohydrates: 0,
                      fat: 0,
                    });
                  }}
                  className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Add ingredient
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="rounded-md border border-zinc-300 bg-white py-2 px-4 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <input
            type="submit"
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          />
        </div>
      </form>
    </FormProvider>
  );
}
