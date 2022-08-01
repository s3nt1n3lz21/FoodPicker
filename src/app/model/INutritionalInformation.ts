export interface INutritionalInformation {
    totalProtein: number;
    totalCalories: number;
}

export function emptyINutritionalInformation(): INutritionalInformation {
    return {
        totalProtein: 0,
        totalCalories: 0
    }
}