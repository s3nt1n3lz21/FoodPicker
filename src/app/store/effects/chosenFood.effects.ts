import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { catchError, map, concatMap } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { NotificationService } from 'src/app/services/notification.service';
import * as FoodActions from '../action/chosenFood.actions';
 
@Injectable()
export class ChosenFoodEffects {
 
  addChosenFood$ = createEffect(
    () => this._actions$.pipe(
            ofType(FoodActions.addChosenFood),
            concatMap((action) => this._apiService.addChosenFood(action.food)
                .pipe(
                    map(
                        (addedFood) => {
                            this._notificationService.addNotification('Chosen Food Added', 'success');
                            return { type: FoodActions.addChosenFoodSuccess.type, payload: addedFood};
                        }
                    ),
                    catchError(
                        () => {
                            this._notificationService.addNotification('Failed To Add Chosen Food', 'error')
                            return EMPTY;
                        }
                    )
                )
            )
    )
  );

  deleteChosenFood$ = createEffect(
    () => this._actions$.pipe(
            ofType(FoodActions.deleteChosenFood),
            concatMap((action) => this._apiService.deleteChosenFood(action.id)
                .pipe(
                    map(
                        () => {
                            this._notificationService.addNotification('Chosen Food Deleted', 'success');
                            return { type: FoodActions.deleteChosenFoodSuccess.type, payload: action.id};
                        }
                    ),
                    catchError(
                        () => {
                            this._notificationService.addNotification('Failed To Delete Chosen Food', 'error')
                            return EMPTY;
                        }
                    )
                )
            )
    )
  );

  getChosenFoods$ = createEffect(
    () => this._actions$.pipe(
            ofType(FoodActions.getChosenFoods),
            concatMap((action) => this._apiService.getChosenFoods()
                .pipe(
                    map(
                        (foods) => {
                            return { type: FoodActions.getChosenFoodsSuccess.type, payload: foods};
                        }
                    ),
                    catchError(
                        () => {
                            this._notificationService.addNotification('Failed To Load Chosen Foods', 'error')
                            return EMPTY;
                        }
                    )
                )
            )
    )
  );

  updateChosenFood$ = createEffect(
    () => this._actions$.pipe(
            ofType(FoodActions.updateChosenFood),
            concatMap((action) => this._apiService.updateChosenFood(action.food)
                .pipe(
                    map(
                        () => {
                            this._notificationService.addNotification('Chosen Food Updated', 'success');
                            return { type: FoodActions.updateChosenFoodSuccess.type, payload: action.food};
                        }
                    ),
                    catchError(
                        () => {
                            this._notificationService.addNotification('Failed To Update Chosen Food', 'error')
                            return EMPTY;
                        }
                    )
                )
            )
    )
  );

  clearChosenFoods$ = createEffect(
    () => this._actions$.pipe(
            ofType(FoodActions.clearChosenFoods),
            concatMap((action) => this._apiService.clearChosenFoods()
                .pipe(
                    map(
                        () => {
                            this._notificationService.addNotification('Cleared Chosen Foods', 'success');
                            return { type: FoodActions.clearChosenFoodsSuccess.type };
                        }
                    ),
                    catchError(
                        () => {
                            this._notificationService.addNotification('Failed To Clear Chosen Foods', 'error')
                            return EMPTY;
                        }
                    )
                )
            )
    )
  );
 
  constructor(
    private _actions$: Actions,
    private _notificationService: NotificationService,
    private _apiService: ApiService
  ) {}
}