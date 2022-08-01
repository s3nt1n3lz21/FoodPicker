import { createAction, props } from '@ngrx/store';
import { IFood, INewFood } from 'src/app/model/IFood';

export const addFood = createAction(
    '[Food] ADD',
    props<{ food: INewFood }>()
);
export const addFoodSuccess = createAction(
    '[Food] ADD SUCCESS',
    props<{ food: IFood }>()
);

export const deleteFood = createAction(
    '[Food] DELETE',
    props<{ id: string }>()
);
export const deleteFoodSuccess = createAction(
    '[Food] DELETE SUCCESS',
    props<{ id: string }>()
);

export const getFoods = createAction(
    '[Food] GET',
);
export const getFoodsSuccess = createAction(
    '[Food] GET SUCCESS',
    props<{ foods: IFood[] }>()
);

export const updateFood = createAction(
    '[Food] UPDATE',
    props<{ food: IFood }>()
);
export const updateFoodSuccess = createAction(
    '[Food] UPDATE SUCCESS',
    props<{ food: IFood }>()
);