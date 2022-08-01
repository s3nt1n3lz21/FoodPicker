import { createAction, props } from '@ngrx/store';
import { IChosenFood, INewChosenFood } from 'src/app/model/IChosenFood';

export const addChosenFood = createAction(
    '[Chosen Food] ADD',
    props<{ food: INewChosenFood }>()
);
export const deleteChosenFood = createAction(
    '[Chosen Food] DELETE',
    props<{ id: string }>()
);
export const getChosenFoods = createAction(
    '[Chosen Food] GET'
);
export const updateChosenFood = createAction(
    '[Chosen Food] UPDATE',
    props<{ food: IChosenFood }>()
)
export const clearChosenFoods = createAction(
    '[Chosen Food] CLEAR'
)