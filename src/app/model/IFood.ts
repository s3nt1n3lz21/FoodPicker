export interface AddFood {
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
}

export interface Food extends AddFood {
    id: string;
}

export function emptyAddFood(): AddFood {
    return {
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
    }
  }

  export function emptyFood(): Food {
    return {
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
        id: '',
    }
  }