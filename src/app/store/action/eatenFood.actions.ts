import { createAction, props } from '@ngrx/store';
import { INewEatenFood } from 'src/app/model/IEatenFood';

export const addFoodEaten = createAction(
    '[Food Eaten] ADD',
    props<{ food: INewEatenFood }>()
);
export const deleteFoodEaten = createAction(
    '[Food Eaten] DELETE',
    props<{ id: string }>()
);
export const getFoodsEaten = createAction(
    '[Food Eaten] GET'
);