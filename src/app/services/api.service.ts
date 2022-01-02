import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { exhaustMap, take } from 'rxjs/operators';
import { Food, AddFood, emptyAddFood, convertFoodToAddFood } from '../model/IFood';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getFoods(): Observable<Food[]> {
    return this.authService.user.pipe(
      take(1), 
      exhaustMap(user => {
        return this.http.get<Food[]>(
          'https://food-picker-e8a62-default-rtdb.europe-west1.firebasedatabase.app/foods.json', 
          {
            params: new HttpParams().set('auth', user.token)
          }
        );
      })
    )
  }

  updateFood(food: Food) {
    const foodWithoutID: AddFood = convertFoodToAddFood(food);

    return this.http.put(
      //?auth=${this.token}
      `https://food-picker-e8a62-default-rtdb.europe-west1.firebasedatabase.app/foods/${food.id}.json`,
      JSON.stringify(foodWithoutID),
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }

  addFood(foodWithoutID: AddFood) {

    return this.http.post(
      `https://food-picker-e8a62-default-rtdb.europe-west1.firebasedatabase.app/foods.json`,
      JSON.stringify(foodWithoutID),
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }

  // addFoods(foods: AddFood[]): Observable<any> {
  //   const response = new Observable();
  //   foods.forEach((food) => {
  //     this.addFood(food);
  //   })
  //   return response;
  // }
}
