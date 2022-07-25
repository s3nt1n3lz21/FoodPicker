import { FormGroup } from "@angular/forms"

export interface AddFood {
    foodId: string; // Id is the database id in the foods list
    name: string;
    url: string;
    extractedPrice: string;
    pricePerAmount: string;
    extractedProteinPer100g: string;
    extractedKJPer100g: string;
    proteinPer100g: number;
    kJPer100g: number;
    caloriesPer100g: number;
    proteinPer100Calorie: number;
    poundsPerAsString: string;
    poundsPer: number;
    perAmount: string;
    poundsPer100g: number;
    price: number;
    multiplesOf100g: number;
    perEachPer100g: number;
    totalCalories: number;
    totalProtein: number;
    rankWeighting: number;
    timesEaten: number;
    poundsPer1000Calories: number;
    ignore: boolean;
    available: boolean;
    availableExpiry: string;
    foodFraction: number;
    dateEaten: string;
}

// Food has been added to a database and has a databaseID
export interface Food extends AddFood {
    databaseID: string;
}

export function emptyAddFood(): AddFood {
    return {
        foodId: '',
        name: '',
        url: '',
        extractedPrice: '',
        pricePerAmount: '',
        extractedProteinPer100g: '',
        extractedKJPer100g: '',
        proteinPer100g: 0,
        kJPer100g: 0,
        caloriesPer100g: 0,
        proteinPer100Calorie: 0,
        poundsPerAsString: '',
        poundsPer: 0,
        perAmount: '',
        poundsPer100g: 0,
        price: 0,
        multiplesOf100g: 0,
        perEachPer100g: 0,
        totalCalories: 0,
        totalProtein: 0,
        rankWeighting: 0,
        timesEaten: 0,
        poundsPer1000Calories: 0,
        ignore: false,
        available: true,
        availableExpiry: new Date().toISOString(),
        foodFraction: 1,
        dateEaten: ''
    }
  }

  export function emptyFood(): Food {
    return {
        foodId: '',
        name: '',
        url: '',
        extractedPrice: '',
        pricePerAmount: '',
        extractedProteinPer100g: '',
        extractedKJPer100g: '',
        proteinPer100g: 0,
        kJPer100g: 0,
        caloriesPer100g: 0,
        proteinPer100Calorie: 0,
        poundsPerAsString: '',
        poundsPer: 0,
        perAmount: '',
        poundsPer100g: 0,
        price: 0,
        multiplesOf100g: 0,
        perEachPer100g: 0,
        totalCalories: 0,
        totalProtein: 0,
        rankWeighting: 0,
        timesEaten: 0,
        poundsPer1000Calories: 0,
        ignore: false,
        available: true,
        availableExpiry: new Date().toISOString(),
        databaseID: '',
        foodFraction: 1,
        dateEaten: ''
    }
  }

export function convertFoodToAddFood(food: Food): AddFood {
    const result: AddFood = emptyAddFood();
    result.foodId = food.foodId;
    result.name = food.name;
    result.url = food.url;
    result.extractedPrice = food.extractedPrice;
    result.pricePerAmount = food.pricePerAmount;
    result.extractedProteinPer100g = food.extractedProteinPer100g;
    result.extractedKJPer100g = food.extractedKJPer100g;
    result.proteinPer100g = food.proteinPer100g;
    result.kJPer100g = food.kJPer100g;
    result.caloriesPer100g = food.caloriesPer100g;
    result.proteinPer100Calorie = food.proteinPer100Calorie;
    result.poundsPerAsString = food.poundsPerAsString;
    result.poundsPer = food.poundsPer;
    result.perAmount = food.perAmount;
    result.poundsPer100g = food.poundsPer100g;
    result.price = food.price;
    result.multiplesOf100g = food.multiplesOf100g;
    result.perEachPer100g = food.perEachPer100g;
    result.totalCalories = food.totalCalories;
    result.totalProtein = food.totalProtein;
    result.rankWeighting = food.rankWeighting;
    result.timesEaten = food.timesEaten;
    result.poundsPer1000Calories = food.poundsPer1000Calories;
    result.ignore = food.ignore;
    result.available = food.available;
    result.availableExpiry = food.availableExpiry;
    result.foodFraction = food.foodFraction;
    result.dateEaten = food.dateEaten;
    return result;
}

export interface IFoodForm extends FormGroup {
    value: Food;
}