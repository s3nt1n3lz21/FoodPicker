import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { catchError, map, concatMap } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { NotificationService } from 'src/app/services/notification.service';
import * as FoodActions from '../action/eatenFood.actions';
 
@Injectable()
export class EatenFoodEffects {
 
  addEatenFood$ = createEffect(
    () => this._actions$.pipe(
            ofType(FoodActions.addEatenFood),
            concatMap((action) => this._apiService.addEatenFood(action.food)
                .pipe(
                    map(
                        (addedFood) => {
                            this._notificationService.addNotification('Eaten Food Added', 'success');
                            return { type: FoodActions.addEatenFoodSuccess.type, payload: addedFood};
                        }
                    ),
                    catchError(
                        () => {
                            this._notificationService.addNotification('Failed To Add Eaten Food', 'error')
                            return EMPTY;
                        }
                    )
                )
            )
    )
  );

  deleteEatenFood$ = createEffect(
    () => this._actions$.pipe(
            ofType(FoodActions.deleteEatenFood),
            concatMap((action) => this._apiService.deleteEatenFood(action.id)
                .pipe(
                    map(
                        () => {
                            this._notificationService.addNotification('Eaten Food Deleted', 'success');
                            return { type: FoodActions.deleteEatenFoodSuccess.type, payload: action.id};
                        }
                    ),
                    catchError(
                        () => {
                            this._notificationService.addNotification('Failed To Delete Eaten Food', 'error')
                            return EMPTY;
                        }
                    )
                )
            )
    )
  );

  getEatenFoods$ = createEffect(
    () => this._actions$.pipe(
            ofType(FoodActions.getEatenFoods),
            concatMap((action) => this._apiService.getEatenFoods()
                .pipe(
                    map(
                        (foods) => {
                            return { type: FoodActions.getEatenFoodsSuccess.type, payload: foods};
                        }
                    ),
                    catchError(
                        () => {
                            this._notificationService.addNotification('Failed To Load Eaten Foods', 'error')
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