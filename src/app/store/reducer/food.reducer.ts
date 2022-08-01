import { createReducer, on } from '@ngrx/store';
import { IFood } from 'src/app/model/IFood';
import * as FoodActions from '../action/food.actions';

export interface FoodsState {
    foods: IFood[]
}

export const initialState: FoodsState = {
    foods: []
};

export const foodsReducer = createReducer(
    initialState,
    on(FoodActions.addFoodSuccess, (state, { food }) => 
    {
        const newFoods = state.foods.slice();
        newFoods.push(food);
        return { ...state, foods: newFoods };
    }),
    on(FoodActions.deleteFoodSuccess, (state, { id }) => 
    {
        const newFoods = state.foods.slice();
        const index = newFoods.findIndex((f) => f.id === id);
        newFoods.splice(index, 1);
        return { ...state, foods: newFoods }
    }),
    on(FoodActions.getFoodsSuccess, (state, { foods }) => {
        return { ...state, foods: foods }
    }),
    on(FoodActions.updateFoodSuccess, (state, { food }) => {
        const newFoods = state.foods.slice();
        const index = newFoods.findIndex((f) => f.id === food.id);
        newFoods[index] = food;
        return { ...state, foods: newFoods }
    })
);