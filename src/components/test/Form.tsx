import { recipeSchema } from "@/types/zod-schemas";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Recipe } from "@prisma/client";
import type { PresignedPost } from "aws-sdk/clients/s3";
import type { UseFormProps } from "react-hook-form";
import { useFieldArray, useForm } from "react-hook-form";
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

type RecipeData = z.infer<typeof recipeSchema>;

export default function Form() {
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

  const onSubmit = async (data) => {
    console.log(data);

    const file = data.image[0];

    const res = {
      name: data.name,
      description: data.description,
      category: data.category,
      image: data.image[0].name,
      difficulty: data.difficulty,
      prepTime: data.prepTime,
      cookTime: data.cookTime,
      servings: data.servings,
      ingredients: data.ingredients,
      instructions: data.instructions,
      favorite: data.favorite,
      shared: data.shared,
    };

    const { presignedUrl }: { presignedUrl: PresignedPost } =
      await createRecipe.mutateAsync(res);

    const { url, fields } = presignedUrl;


     const imgData = {
       ...fields,
       "Content-Type": file.type,
       file,
     };

     const formData = new FormData();

     for (const name in imgData) {
       formData.append(name, imgData[name]);
     }

     await fetch(url, {
       method: "POST",
       body: formData,
     });


    // await createRecipe.mutateAsync(res);
    console.log(res);
  };
  const onError = (errors, e) => console.log(errors, e);
  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <div>
        <input type="text" {...register("name")} />
      </div>
      <div>
        <input type="text" {...register("description")} />
      </div>
      <div>
        <input type="text" {...register("category")} />
      </div>
      <div>
        <input type="file" {...register("image")} />
      </div>
      <div>
        <input type="text" {...register("difficulty")} />
      </div>
      <div>
        <input type="text" {...register("prepTime")} />
      </div>
      <div>
        <input type="text" {...register("cookTime")} />
      </div>
      <div>
        <input
          type="number"
          onChange={(e) => {
            setValue("servings", parseInt(e.target.value));
          }}
        />
      </div>

      {ingredientFields.map((field, index) => (
        <div key={field.id}>
          <input type="text" {...register(`ingredients.${index}.name`)} />
          <input
            type="number"
            onChange={(e) => {
              setValue(
                `ingredients.${index}.quantity`,
                parseInt(e.target.value)
              );
            }}
          />
          <input
            type="number"
            onChange={(e) => {
              setValue(
                `ingredients.${index}.calories`,
                parseInt(e.target.value)
              );
            }}
          />
          <input
            type="number"
            onChange={(e) => {
              setValue(
                `ingredients.${index}.protein`,
                parseInt(e.target.value)
              );
            }}
          />
          <input
            type="number"
            onChange={(e) => {
              setValue(
                `ingredients.${index}.carbohydrates`,
                parseInt(e.target.value)
              );
            }}
          />
          <input
            type="number"
            onChange={(e) => {
              setValue(`ingredients.${index}.fat`, parseInt(e.target.value));
            }}
          />
          <button type="button" onClick={() => ingredientRemove(index)}>
            Delete
          </button>
        </div>
      ))}
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
      >
        append
      </button>
      <div>
        {instructionsFields.map((item, index) => {
          return (
            <div key={item.id}>
              <input type="text" {...register(`instructions.${index}.text`)} />
              <button type="button" onClick={() => instructionsRemove(index)}>
                Delete
              </button>
            </div>
          );
        })}
        <button type="button" onClick={() => instructionsAppend()}>
          Add
        </button>
      </div>

      <input type="checkbox" {...register("favorite")} />
      <input type="checkbox" {...register("shared")} />

      <button type="submit">Submit</button>
    </form>
  );
}
