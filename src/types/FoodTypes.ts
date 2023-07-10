import { IngredientProps } from "./IngredientTypes";

export type FoodProps = {
  id: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image: string;
  ingredientsList?: IngredientProps[];
  foodCategory: string;
};
