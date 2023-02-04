export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
}

export interface Instruction {
  id: string;
  recipeId: string;
  text: string;
}
