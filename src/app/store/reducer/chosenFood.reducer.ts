import { createReducer, on } from '@ngrx/store';
import { IChosenFood } from 'src/app/model/IChosenFood';
import * as ChosenFoodActions from '../action/chosenFood.actions';

export interface ChosenFoodsState {
    chosenFoods: IChosenFood[]
}

export const initialState: ChosenFoodsState = {
    chosenFoods: []
};

export const chosenFoodsReducer = createReducer(
    initialState,
    on(ChosenFoodActions.addChosenFoodSuccess, (state, { food }) => 
    {
        const newChosenFoods = state.chosenFoods.slice();
        newChosenFoods.push(food);
        return { ...state, chosenFoods: newChosenFoods };
    }),
    on(ChosenFoodActions.deleteChosenFoodSuccess, (state, { id }) => 
    {
        const newChosenFoods = state.chosenFoods.slice();
        const index = newChosenFoods.findIndex((f) => f.id === id);
        newChosenFoods.splice(index, 1);
        return { ...state, chosenFoods: newChosenFoods }
    }),
    on(ChosenFoodActions.getChosenFoodsSuccess, (state, { foods }) => 
    {
        return { ...state, chosenFoods: foods }
    }),
    on(ChosenFoodActions.updateChosenFoodSuccess, (state, { food }) =>
    {
        const newChosenFoods = state.chosenFoods.slice();
        const index = newChosenFoods.findIndex((f) => f.id === food.id);
        newChosenFoods[index] = food;
        return { ...state, chosenFoods: newChosenFoods }
    }),
    on(ChosenFoodActions.clearChosenFoodsSuccess, (state) => 
    {
        return { ...state, chosenFoods: [] }
    }),
);