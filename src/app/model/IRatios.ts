export interface IRatios {
    proteinPer100Calories: number;
    poundsPer1000Calories: number;
}

export function emptyIRatios(): IRatios {
    return {
        proteinPer100Calories: 0,
        poundsPer1000Calories: 99999
    }
}