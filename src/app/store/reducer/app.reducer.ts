import { ActionReducerMap } from "@ngrx/store"
import { chosenFoodsReducer, ChosenFoodsState } from "./chosenFood.reducer";
import { eatenFoodsReducer, EatenFoodsState } from "./eatenFood.reducer";
import { foodsReducer, FoodsState } from "./food.reducer";

export interface AppState {
    foods: FoodsState,
    eatenFoods: EatenFoodsState,
    chosenFoods: ChosenFoodsState
}

export const appReducer: ActionReducerMap<AppState> = {
    foods: foodsReducer,
    eatenFoods: eatenFoodsReducer,
    chosenFoods: chosenFoodsReducer
};