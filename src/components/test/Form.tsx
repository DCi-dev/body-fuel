import { recipeSchema } from "@/types/zod-schemas";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ChangeEvent } from "react";
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

export default function Form() {
  const methods = useZodForm({
    schema: recipeSchema,
  });

  const { register, handleSubmit, control, setValue, getValues, errors } =
    methods;

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

    await createRecipe.mutateAsync(data);
    console.log(data);
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
