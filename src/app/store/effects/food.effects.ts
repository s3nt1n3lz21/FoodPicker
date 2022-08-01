import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY } from 'rxjs';
import { catchError, map, tap, concatMap } from 'rxjs/operators';
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
                        () => {
                            this._notificationService.addNotification('Food Added', 'success');
                            return { type: FoodActions.addFoodSuccess.type, payload: action.food};
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

  addFoodSuccess$ = createEffect(
    () => this._actions$.pipe(
            ofType(FoodActions.addFoodSuccess),
            tap(
                (action) => 
                    {
                        this._store.dispatch(FoodActions.addFood({ food: action.food }))
                        this._notificationService.addNotification('Food Added', 'success')
                    }
            ),
            catchError(
                () => {
                    this._notificationService.addNotification('Food Added', 'success')
                    return EMPTY
                }
            )
    )
  );
 
  constructor(
    private _actions$: Actions,
    private _store: Store,
    private _notificationService: NotificationService,
    private _apiService: ApiService
  ) {}
}