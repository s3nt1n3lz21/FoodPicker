import { emptyIFood, IFood } from "./IFood";

// New eaten food that has not been added to database and has no ID
export interface INewEatenFood {
    food: IFood,
    dateEaten: string;
    foodFraction: number;
}

export function emptyINewEatenFood(): INewEatenFood {
    return {
        food: emptyIFood(),
        dateEaten: new Date().toISOString(),
        foodFraction: 0
    }
}

// Eaten food added to the database and has ID
export interface IEatenFood extends INewEatenFood {
    id: string,
}

export function emptyIEatenFood(): IEatenFood {
    return {
        id: '',
        ...emptyINewEatenFood()
    }
}