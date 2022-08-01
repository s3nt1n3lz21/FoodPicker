import { emptyIFood, IFood } from "./IFood";

// New chosen food that hasn't been added to database and has no ID
export interface INewChosenFood {
    food: IFood
}

export function emptyINewChosenFood(): INewChosenFood {
    return {
        food: emptyIFood()
    }
}

// Has been added to the database and has ID
export interface IChosenFood extends INewChosenFood {
    id: string,
}

export function emptyIChosenFood(): IChosenFood {
    return {
        id: '',
        ...emptyINewChosenFood()
    }
}

export function convertChosenFoodToNewChosenFood(chosenFood: IChosenFood): INewChosenFood {
    const newChosenFood: INewChosenFood = emptyINewChosenFood();
    newChosenFood.food = chosenFood.food;
    return newChosenFood;
}