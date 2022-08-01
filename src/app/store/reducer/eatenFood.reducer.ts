import { createReducer, on } from '@ngrx/store';
import { IEatenFood } from 'src/app/model/IEatenFood';
import * as EatenFoodActions from '../action/eatenFood.actions';

export interface EatenFoodState {
    eatenFoods: IEatenFood[]
}

export const initialState: EatenFoodState = {
    eatenFoods: []
};

export const foodEatenReducer = createReducer(
    initialState,
    on(EatenFoodActions.addFoodEaten, (state) => {
        eatenFoods
    }
    ),
    on(EatenFoodActions.deleteFoodEaten, (state) => state - 1),
    on(EatenFoodActions.getFoodsEaten, (state) => 0),
);