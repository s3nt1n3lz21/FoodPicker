import { createAction, props } from '@ngrx/store';
import { IFood, INewFood } from 'src/app/model/IFood';

export const addFood = createAction(
    '[Food] ADD',
    props<{ food: INewFood }>()
);
export const addFoodSuccess = createAction(
    '[Food] ADD',
    props<{ food: INewFood }>()
);

export const deleteFood = createAction(
    '[Food] DELETE',
    props<{ id: string }>()
);
export const getFoods = createAction(
    '[Food] GET',
);
export const updateFood = createAction(
    '[Food] UPDATE',
    props<{ food: IFood }>()
)