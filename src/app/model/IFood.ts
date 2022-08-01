import { FormGroup } from "@angular/forms"
import { IIngredient } from "./IIngredient";
import { emptyINutritionalInformation, INutritionalInformation } from "./INutritionalInformation";
import { emptyIRatios, IRatios } from "./IRatios";

// Food has not been added to the database yet and has no ID
export interface INewFood {
    name: string;
    url: string;
    price: number;
    ingredients: IIngredient[];
    nutritionalInformation: INutritionalInformation;
    timesEaten: number;
    availableToBuy: boolean; // Currently out of stock
    availableExpiry: string; // When to start checking is in stock again
    noLongerPurchasable: boolean;
    rank: number;
    ignore: boolean;
    ratios: IRatios;
}

// Food has been added to a database and has an ID
export interface IFood extends INewFood {
    id: string;
}

export function emptyINewFood(): INewFood {
    return {
        name: '',
        url: '',
        price: 0,
        ingredients: [],
        nutritionalInformation: emptyINutritionalInformation(),
        timesEaten: 0,
        availableToBuy: true,
        availableExpiry: new Date().toISOString(),
        noLongerPurchasable: false,
        rank: 0,
        ignore: false,
        ratios: emptyIRatios()
    }
  }

  export function emptyIFood(): IFood {
    return {
        id: '',
        ...emptyINewFood()
    }
  }

export function convertFoodToNewFood(food: IFood): INewFood {
    const newFood: INewFood = emptyINewFood();
    newFood.name = food.name;
    newFood.url = food.url;
    newFood.price = food.price;
    newFood.ingredients = food.ingredients;
    newFood.nutritionalInformation = food.nutritionalInformation;
    newFood.timesEaten = food.timesEaten;
    newFood.availableToBuy = food.availableToBuy;
    newFood.availableExpiry = food.availableExpiry;
    newFood.noLongerPurchasable = food.noLongerPurchasable;
    newFood.rank = food.rank;
    newFood.ignore = food.ignore;
    newFood.ratios = food.ratios;
    return newFood;
}

export interface IFoodForm extends FormGroup {
    value: IFood;
}