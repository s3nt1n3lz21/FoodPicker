import { createReducer, on } from '@ngrx/store';
import { IChosenFood } from 'src/app/model/IChosenFood';
import * as ChosenFoodActions from '../action/chosenFood.actions';

export interface ChosenFoodState {
    chosenFoods: IChosenFood[]
}

export const initialState: ChosenFoodState = {
    chosenFoods: []
};

export const chosenFoodReducer = createReducer(
    initialState,
    on(ChosenFoodActions.addChosenFood, (state, {food}) => 
        { 
            let newChosenFoods: IChosenFood[] = { ...state.chosenFoods}
            newChosenFoods.push(food)
            return            {
                ...state,
                chosenFoods: newChosenFoods
            }
        }
    ),
    on(ChosenFoodActions.deleteChosenFood, (state) => state - 1),
    on(ChosenFoodActions.getChosenFoods, (state) => 0),
    on(ChosenFoodActions.updateChosenFood, (state) => 0),
    on(ChosenFoodActions.clearChosenFoods, (state) => 0),
);