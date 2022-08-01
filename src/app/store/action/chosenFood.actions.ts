import { createAction, props } from '@ngrx/store';
import { IChosenFood, INewChosenFood } from 'src/app/model/IChosenFood';

export const addChosenFood = createAction(
    '[Chosen Food] ADD',
    props<{ food: INewChosenFood }>()
);
export const addChosenFoodSuccess = createAction(
    '[Chosen Food] ADD SUCCESS',
    props<{ food: IChosenFood }>()
);

export const deleteChosenFood = createAction(
    '[Chosen Food] DELETE',
    props<{ id: string }>()
);
export const deleteChosenFoodSuccess = createAction(
    '[Chosen Food] DELETE SUCCESS',
    props<{ id: string }>()
);

export const getChosenFoods = createAction(
    '[Chosen Food] GET'
);
export const getChosenFoodsSuccess = createAction(
    '[Chosen Food] GET SUCCESS',
    props<{ foods: IChosenFood[] }>()
);

export const updateChosenFood = createAction(
    '[Chosen Food] UPDATE',
    props<{ food: IChosenFood }>()
)
export const updateChosenFoodSuccess = createAction(
    '[Chosen Food] UPDATE SUCCESS',
    props<{ food: IChosenFood }>()
)

export const clearChosenFoods = createAction(
    '[Chosen Food] CLEAR'
)
export const clearChosenFoodsSuccess = createAction(
    '[Chosen Food] CLEAR SUCCESS'
)