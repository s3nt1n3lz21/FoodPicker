import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { catchError, map, concatMap } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { NotificationService } from 'src/app/services/notification.service';
import * as FoodActions from '../action/food.actions';
 
@Injectable()
export class FoodEffects {
 
  addFood$ = createEffect(
    () => this._actions$.pipe(
            ofType(FoodActions.addFood),
            concatMap((action) => this._apiService.addFood(action.food)
                .pipe(
                    map(
                        (addedFood) => {
                            this._notificationService.addNotification('Food Added', 'success');
                            return { type: FoodActions.addFoodSuccess.type, payload: addedFood};
                        }
                    ),
                    catchError(
                        () => {
                            this._notificationService.addNotification('Failed To Add Food', 'error')
                            return EMPTY;
                        }
                    )
                )
            )
    )
  );

  deleteFood$ = createEffect(
    () => this._actions$.pipe(
            ofType(FoodActions.deleteFood),
            concatMap((action) => this._apiService.deleteFood(action.id)
                .pipe(
                    map(
                        () => {
                            this._notificationService.addNotification('Food Deleted', 'success');
                            return { type: FoodActions.deleteFoodSuccess.type, payload: action.id};
                        }
                    ),
                    catchError(
                        () => {
                            this._notificationService.addNotification('Failed To Delete Food', 'error')
                            return EMPTY;
                        }
                    )
                )
            )
    )
  );

  getFoods$ = createEffect(
    () => this._actions$.pipe(
            ofType(FoodActions.getFoods),
            concatMap((action) => this._apiService.getFoods()
                .pipe(
                    map(
                        (foods) => {
                            return { type: FoodActions.getFoodsSuccess.type, payload: foods};
                        }
                    ),
                    catchError(
                        () => {
                            this._notificationService.addNotification('Failed To Load Foods', 'error')
                            return EMPTY;
                        }
                    )
                )
            )
    )
  );

  updateFood$ = createEffect(
    () => this._actions$.pipe(
            ofType(FoodActions.updateFood),
            concatMap((action) => this._apiService.updateFood(action.food)
                .pipe(
                    map(
                        () => {
                            this._notificationService.addNotification('Food Updated', 'success');
                            return { type: FoodActions.updateFoodSuccess.type, payload: action.food};
                        }
                    ),
                    catchError(
                        () => {
                            this._notificationService.addNotification('Failed To Update Food', 'error')
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