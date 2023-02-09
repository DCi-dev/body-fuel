import { recipeSchema } from "@/types/zod-schemas";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PresignedPost } from "aws-sdk/clients/s3";
import Image from "next/image";
import { useState } from "react";
import type { SubmitHandler, UseFormProps } from "react-hook-form";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import type { z } from "zod";

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

type FormValues = z.infer<typeof recipeSchema>;

export default function CreateRecipeForm() {
  // Image
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImage(e.target.files?.[0] || null);
    await register("image").onChange(e);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setImage(e.dataTransfer.files[0] || null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Form logic
  const methods = useZodForm({
    schema: recipeSchema,
  });

  const { register, handleSubmit, control, setValue } = methods;

  const {
    fields: ingredientFields,
    append: ingredientAppend,
    remove: ingredientRemove,
  } = useFieldArray({
    control: control, // control props comes from useForm (optional: if you are using FormContext)
    name: "ingredients", // unique name for your Field Array
  });

  const {
    fields: instructionsFields,
    append: instructionsAppend,
    remove: instructionsRemove,
  } = useFieldArray({
    control: control, // control props comes from useForm (optional: if you are using FormContext)
    name: "instructions", // unique name for your Field Array
  });

  const createRecipe = api.recipe.createRecipe.useMutation();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    toast.loading("Waiting...");
    const file = image;

    const res = {
      name: data.name,
      slug: data.name
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, "")
        .replace(/\s+/g, "-"),
      description: data.description,
      category: data.category,
      image: image ? image : data.image,
      difficulty: data.difficulty,
      prepTime: data.prepTime,
      cookTime: data.cookTime,
      servings: data.servings,
      ingredients: data.ingredients,
      instructions: data.instructions,
      shared: data.shared,
    };

    const result = await createRecipe.mutateAsync(res);
    if (result) {
      const { presignedUrl }: { presignedUrl: PresignedPost } = result;

      const { url, fields } = presignedUrl;

      const imgData = {
        ...fields,
        "Content-Type": file?.type,
        file,
      };

      const formData = new FormData();

      for (const name in imgData) {
        const key: string = name;
        formData.append(name, imgData[key]);
      }

      await fetch(url, {
        method: "POST",
        body: formData,
      });
    }
    toast.dismiss();
    toast.success("Recipe created!");
  };

  return (
    <form className="space-y-6 px-3" 
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-zinc-200 px-4 py-5 shadow dark:bg-zinc-800 sm:rounded-lg sm:p-6">
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          <div className="lg:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-zinc-900 dark:text-zinc-100">
              RecipeDetails
            </h3>
            <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
              General details about your recipe.
            </p>
          </div>
          <div className="mt-5 space-y-6 lg:col-span-2 lg:mt-0">
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-3 sm:col-span-1">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Recipe Name
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    {...register("name")}
                    className="block w-full flex-1 rounded-none rounded-r-md border-zinc-300 pl-1 focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                    placeholder="Parmesan Crusted Chicken"
                  />
                </div>
              </div>
              <div className="col-span-3 sm:col-span-1">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Category
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    {...register("category")}
                    className="block w-full flex-1 rounded-none rounded-r-md border-zinc-300 pl-1 focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                    placeholder="Breakfast"
                  />
                </div>
              </div>
              <div className="col-span-3 sm:col-span-1">
                <div className="flex justify-between">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Difficulty
                  </label>
                  <span
                    className="text-sm text-zinc-600 dark:text-zinc-400"
                    id="difficulty-optional"
                  >
                    Optional
                  </span>
                </div>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    {...register("difficulty")}
                    className="block w-full flex-1 rounded-none rounded-r-md border-zinc-300 pl-1 focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                    placeholder="Easy"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-3 sm:col-span-1">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Number of servings
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="number"
                    onChange={(e) => {
                      setValue("servings", parseInt(e.target.value));
                    }}
                    className="block w-full flex-1 rounded-none rounded-r-md border-zinc-300 pl-1 focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="col-span-3 sm:col-span-1">
                <div className="flex justify-between">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Prep time
                  </label>
                  <span
                    className="text-sm text-zinc-600 dark:text-zinc-400"
                    id="prepTime-optional"
                  >
                    Optional
                  </span>
                </div>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    {...register("prepTime")}
                    className="block w-full flex-1 rounded-none rounded-r-md border-zinc-300 pl-1 focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                    placeholder="12 minutes"
                  />
                </div>
              </div>
              <div className="col-span-3 sm:col-span-1">
                <div className="flex justify-between">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Cook time
                  </label>
                  <span
                    className="text-sm text-zinc-600 dark:text-zinc-400"
                    id="email-optional"
                  >
                    Optional
                  </span>
                </div>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    {...register("cookTime")}
                    className="block w-full flex-1 rounded-none rounded-r-md border-zinc-300 pl-1 focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                    placeholder="half an hour"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Description
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  {...register("description")}
                  rows={3}
                  className="block w-full rounded-md border-zinc-300 p-1 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                  placeholder="This is a simple and crispy oven baked chicken."
                  defaultValue={""}
                />
              </div>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Brief description for your recipe.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Recipe Image
              </label>
              <div
                className="mt-1 flex justify-center rounded-md border-2 border-dashed border-zinc-300 px-6 pt-5 pb-6 dark:border-zinc-700"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div className="space-y-1 overflow-hidden text-center">
                  {image ? (
                    <div className="grid items-center justify-between lg:grid-cols-2">
                      <Image
                        src={URL.createObjectURL(image)}
                        alt="Preview"
                        width={1000}
                        height={500}
                        className="max-h-52 w-auto"
                      />
                      <label className="relative mt-6 cursor-pointer rounded-md bg-zinc-200 font-medium text-yellow-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-yellow-500 focus-within:ring-offset-2 hover:text-yellow-500 dark:bg-zinc-800 lg:mt-0 lg:ml-6">
                        <span>Change image</span>
                        <input
                          className="sr-only"
                          type="file"
                          name="image"
                          accept="image/*"
                          // eslint-disable-next-line @typescript-eslint/no-misused-promises
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  ) : (
                    <>
                      <svg
                        className="mx-auto h-12 w-12 text-zinc-600 dark:text-zinc-400"
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
                      <div className="flex text-sm text-zinc-600 dark:text-zinc-400">
                        <label className="relative cursor-pointer rounded-md bg-zinc-200 px-2 font-medium text-yellow-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-yellow-500 focus-within:ring-offset-2 hover:text-yellow-500 dark:bg-zinc-800">
                          <span>Upload a image</span>
                          <input
                            name="image"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            // eslint-disable-next-line @typescript-eslint/no-misused-promises
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">
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

      <div className="bg-zinc-200 px-4 py-5 shadow dark:bg-zinc-800 sm:rounded-lg sm:p-6">
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          <div className="lg:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-zinc-900 dark:text-zinc-100">
              Ingredients
            </h3>
            <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
              What ingredients do you need for this recipe?
            </p>
          </div>
          <div className="mt-5 lg:col-span-2 lg:mt-0">
            {ingredientFields.map((field, index) => (
              <div key={field.id} className="mt-5 mb-6 lg:col-span-2 lg:mt-0">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-3 sm:col-span-2">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Unit of measure - Ingredient name
                    </label>
                    <input
                      type="text"
                      {...register(`ingredients.${index}.name`)}
                      placeholder="Eggs, flour, etc."
                      className="mt-1 block w-full rounded-md border-zinc-300 pl-2 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                    />
                  </div>

                  <div className="col-span-3 sm:col-span-2">
                    <div className="flex justify-between">
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Quantity
                      </label>
                      <span
                        className="text-sm text-zinc-600 dark:text-zinc-400"
                        id="email-optional"
                      >
                        grams, ml, etc.
                      </span>
                    </div>
                    <div className="mt-1">
                      <input
                        type="number"
                        step={0.1}
                        onChange={(e) => {
                          setValue(
                            `ingredients.${index}.quantity`,
                            parseInt(e.target.value)
                          );
                        }}
                        className="block w-full appearance-none rounded-md border-zinc-300 pl-2 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                        placeholder="1.1"
                      />
                    </div>
                  </div>

                  <div className="col-span-3 sm:col-span-2">
                    <div className="flex justify-between">
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Calories
                      </label>
                      <span
                        className="text-sm text-zinc-600 dark:text-zinc-400"
                        id="email-optional"
                      >
                        Optional
                      </span>
                    </div>
                    <div className="mt-1">
                      <input
                        type="number"
                        step={0.1}
                        onChange={(e) => {
                          setValue(
                            `ingredients.${index}.calories`,
                            parseInt(e.target.value)
                          );
                        }}
                        className="block w-full appearance-none rounded-md border-zinc-300 pl-2 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                        placeholder="100"
                        aria-describedby="optional"
                      />
                    </div>
                  </div>

                  <div className="col-span-3 sm:col-span-2">
                    <div className="flex justify-between">
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Protein
                      </label>
                      <span
                        className="text-sm text-zinc-600 dark:text-zinc-400"
                        id="email-optional"
                      >
                        Optional
                      </span>
                    </div>
                    <div className="mt-1">
                      <input
                        type="number"
                        step={0.1}
                        onChange={(e) => {
                          setValue(
                            `ingredients.${index}.protein`,
                            parseInt(e.target.value)
                          );
                        }}
                        className="block w-full appearance-none rounded-md border-zinc-300 pl-2 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                        placeholder="100"
                        aria-describedby="optional"
                      />
                    </div>
                  </div>

                  <div className="col-span-3 sm:col-span-2">
                    <div className="flex justify-between">
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Carbohydrates
                      </label>
                      <span
                        className="text-sm text-zinc-600 dark:text-zinc-400"
                        id="email-optional"
                      >
                        Optional
                      </span>
                    </div>
                    <div className="mt-1">
                      <input
                        type="number"
                        step={0.1}
                        onChange={(e) => {
                          setValue(
                            `ingredients.${index}.carbohydrates`,
                            parseInt(e.target.value)
                          );
                        }}
                        className="block w-full appearance-none rounded-md border-zinc-300 pl-2 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                        placeholder="100"
                        aria-describedby="optional"
                      />
                    </div>
                  </div>

                  <div className="col-span-3 sm:col-span-2">
                    <div className="flex justify-between">
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Fat
                      </label>
                      <span
                        className="text-sm text-zinc-600 dark:text-zinc-400"
                        id="email-optional"
                      >
                        Optional
                      </span>
                    </div>
                    <div className="mt-1">
                      <input
                        type="number"
                        step={0.1}
                        onChange={(e) => {
                          setValue(
                            `ingredients.${index}.fat`,
                            parseInt(e.target.value)
                          );
                        }}
                        className="block w-full appearance-none rounded-md border-zinc-300 pl-2 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                        placeholder="100"
                        aria-describedby="optional"
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => ingredientRemove(index)}
                  className="mt-6 rounded-md border border-zinc-300 bg-white py-2 px-4 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  ingredientAppend({
                    name: "",
                    quantity: 0,
                    calories: 0,
                    protein: 0,
                    carbohydrates: 0,
                    fat: 0,
                  });
                }}
                className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-yellow-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              >
                Add ingredient
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Instructions START */}
      <div className="bg-zinc-200 px-4 py-5 shadow dark:bg-zinc-800 sm:rounded-lg sm:p-6">
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          <div className="lg:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-zinc-900 dark:text-zinc-100">
              Instructions
            </h3>
            <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
              What are the steps to make this recipe?
            </p>
          </div>
          <div className="mt-5 lg:col-span-2 lg:mt-0">
            {instructionsFields.map((field, index) => (
              <div key={field.id}>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Instruction
                  </label>
                  <div className="mt-1">
                    <textarea
                      {...register(`instructions.${index}.text`)}
                      rows={2}
                      className="block w-full rounded-md border-zinc-300 pl-2 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                      placeholder="This is a simple and crispy oven baked chicken."
                      defaultValue={""}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => instructionsRemove(index)}
                  className="mt-6 rounded-md border border-zinc-300 bg-white py-2 px-4 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  instructionsAppend({
                    text: "",
                  });
                }}
                className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-yellow-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              >
                Add instruction
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Instructions END */}

      <div className="flex justify-end">
        <legend className="sr-only">Share</legend>
        <div className="relative flex items-start">
          <div className="flex h-5 items-center">
            <input
              type="checkbox"
              {...register("shared")}
              className="h-4 w-4 rounded border-zinc-300 text-yellow-600 focus:ring-yellow-500 dark:border-zinc-700"
            />
          </div>
          <div className="ml-3 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              Share
            </span>
            <p className="text-zinc-700 dark:text-zinc-300">
              Share this recipe with other users.
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-end pb-6">
        <button
          type="button"
          className="rounded-md border border-zinc-300 bg-white py-2 px-4 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <input
          type="submit"
          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-yellow-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
        />
      </div>
    </form>
  );
}
