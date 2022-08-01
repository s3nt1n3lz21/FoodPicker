import { createReducer, on } from '@ngrx/store';
import { IEatenFood } from 'src/app/model/IEatenFood';
import * as EatenFoodActions from '../action/eatenFood.actions';

export interface EatenFoodsState {
    eatenFoods: IEatenFood[]
}

export const initialState: EatenFoodsState = {
    eatenFoods: []
};

export const eatenFoodsReducer = createReducer(
    initialState,
    on(EatenFoodActions.addEatenFoodSuccess, (state, { food }) => 
    {
        const newEatenFoods = state.eatenFoods.slice();
        newEatenFoods.push(food);
        return { ...state, eatenFoods: newEatenFoods };
    }),
    on(EatenFoodActions.deleteEatenFoodSuccess, (state, { id }) => 
    {
        const newEatenFoods = state.eatenFoods.slice();
        const index = newEatenFoods.findIndex((f) => f.id === id);
        newEatenFoods.splice(index, 1);
        return { ...state, eatenFoods: newEatenFoods }
    }),
    on(EatenFoodActions.getEatenFoodsSuccess, (state, { eatenFoods }) => {
        return { ...state, eatenFoods: eatenFoods }
    }),
);