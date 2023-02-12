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

export interface RecipeType {
  id: string;
  name: string;
  slug: string;
  description: string;
  servings: number;
  image: string;
  ingredients?: Ingredient[];
  instructions?: Instruction[];
  shared: boolean;
  category:
    | "Breakfast"
    | "Salads"
    | "MainCourse"
    | "Sides"
    | "Snacks"
    | "Desserts"
    | "Drinks"
    | "SaucesAndDressings";
  prepTime: string;
  cookTime: string;
  difficulty: string;
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  user: {
    id: string;
    name: string;
    image: string;
  };
  userId: string;
}

export interface Review {
  id: string;
  recipeId: string;
  comments: string;
  stars: number;
  user: {
    id: string;
    name: string;
    image: string;
  };
  userId: string;
}

export interface MealJournalType {
  id?: string;
  date?: string;
  userId?: string;
  mealItems?: MealJournalItemType[];
}

export interface MealJournalItemType {
  id?: string;
  mealJournalId?: string;
  recipe?: RecipeType;
  servings?: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}
