import { createAction, props } from '@ngrx/store';
import { IEatenFood, INewEatenFood } from 'src/app/model/IEatenFood';

export const addEatenFood = createAction(
    '[Eaten Food] ADD',
    props<{ food: INewEatenFood }>()
);
export const addEatenFoodSuccess = createAction(
    '[Eaten Food] ADD SUCCESS',
    props<{ food: IEatenFood }>()
);

export const deleteEatenFood = createAction(
    '[Eaten Food] DELETE',
    props<{ id: string }>()
);
export const deleteEatenFoodSuccess = createAction(
    '[Eaten Food] DELETE SUCCESS',
    props<{ id: string }>()
);

export const getEatenFoods = createAction(
    '[Eaten Food] GET'
);
export const getEatenFoodsSuccess = createAction(
    '[Eaten Food] GET SUCCESS',
    props<{ eatenFoods: IEatenFood[] }>()
);