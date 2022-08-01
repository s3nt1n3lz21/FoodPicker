import { createReducer, on } from '@ngrx/store';
import { IFood } from 'src/app/model/IFood';
import * as FoodActions from '../action/food.actions';

export interface FoodState {
    foods: IFood[]
}

export const initialState: FoodState = {
    foods: []
};

export const foodReducer = createReducer(
    initialState,
    on(FoodActions.addFood, (state) => state + 1),
    on(FoodActions.deleteFood, (state) => state - 1),
    on(FoodActions.getFoods, (state) => 0),
    on(FoodActions.updateFood, (state) => 0)
);