import { recipeSchema } from "@/types/zod-schemas";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent } from "react";
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

  const ingredientArray = useFieldArray({
    control: methods.control, // control props comes from useForm (optional: if you are using FormContext)
    name: "ingredients", // unique name for your Field Array
  });
  const instructionArray = useFieldArray({
    control: methods.control, // control props comes from useForm (optional: if you are using FormContext)
    name: "instruction", // unique name for your Field Array
  });

  const createRecipe = api.recipe.createRecipe.useMutation();

  const onSubmit = async (data, e) => {
    createRecipe.mutate(data);
    console.log(data, e);
  };
  const onError = (errors, e) => console.log(errors, e);
  return (
    <form onSubmit={methods.handleSubmit(onSubmit, onError)}>
      <div>
        <input type="text" {...methods.register("name")} />
      </div>
      <div>
        <input type="text" {...methods.register("description")} />
      </div>
      <div>
        <input type="text" {...methods.register("category")} />
      </div>
      <div>
        <input type="file" {...methods.register("image")} />
      </div>
      <div>
        <input type="text" {...methods.register("difficulty")} />
      </div>
      <div>
        <input type="text" {...methods.register("prepTime")} />
      </div>
      <div>
        <input type="text" {...methods.register("cookTime")} />
      </div>
      <div>
        <input
          type="number"
          onChange={(e) => {
            methods.setValue("servings", parseInt(e.target.value));
          }}
        />
      </div>

      {ingredientArray.fields.map((field, index) => (
        <>
          <div key={field.id}>
            <input
              type="text"
              {...methods.register(`ingredients.${index}.name`)}
            />
            <input
              type="number"
              onChange={(e) => {
                methods.setValue(
                  `ingredients.${index}.quantity`,
                  parseInt(e.target.value)
                );
              }}
            />
            <input
              type="number"
              onChange={(e) => {
                methods.setValue(
                  `ingredients.${index}.calories`,
                  parseInt(e.target.value)
                );
              }}
            />
            <input
              type="number"
              onChange={(e) => {
                methods.setValue(
                  `ingredients.${index}.protein`,
                  parseInt(e.target.value)
                );
              }}
            />
            <input
              type="number"
              onChange={(e) => {
                methods.setValue(
                  `ingredients.${index}.carbohydrates`,
                  parseInt(e.target.value)
                );
              }}
            />
            <input
              type="number"
              onChange={(e) => {
                methods.setValue(
                  `ingredients.${index}.fat`,
                  parseInt(e.target.value)
                );
              }}
            />
          </div>
        </>
      ))}
      <button
        type="button"
        onClick={() => {
          ingredientArray.append({
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
      {instructionArray.fields.map((field, index) => (
        <input
          type="text"
          key={field.id}
          {...methods.register(`instructions.${index}`)}
        />
      ))}
      <button
        type="button"
        onClick={() => {
          instructionArray.append({
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
      <input type="checkbox" {...methods.register("favorite")} />
      <input type="checkbox" {...methods.register("shared")} />

      <button type="submit">Submit</button>
    </form>
  );
}
