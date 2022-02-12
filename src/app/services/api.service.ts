import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Food, AddFood, convertFoodToAddFood } from '../model/IFood';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  getFoods(): Observable<Food[]> {
    return this.http.get<Food[]>(
      'https://food-picker-e8a62-default-rtdb.europe-west1.firebasedatabase.app/foods.json', 
    );
  }

  getChosenFoods(): Observable<Food[]> {
    return this.http.get<Food[]>(
      'https://food-picker-e8a62-default-rtdb.europe-west1.firebasedatabase.app/chosenFoods.json', 
    );
  }

  clearChosenFoods(): Observable<Food[]> {
    return this.http.delete<Food[]>(
      'https://food-picker-e8a62-default-rtdb.europe-west1.firebasedatabase.app/chosenFoods.json', 
    );
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

  addChosenFood(foodWithoutID: AddFood) {

    return this.http.post(
      `https://food-picker-e8a62-default-rtdb.europe-west1.firebasedatabase.app/chosenFoods.json`,
      JSON.stringify(foodWithoutID),
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }

  removeChosenFood(food: Food) {

    return this.http.delete(
      //?auth=${this.token}
      `https://food-picker-e8a62-default-rtdb.europe-west1.firebasedatabase.app/chosenFoods/${food.id}.json`,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }

  addFoodEaten(foodWithoutID: AddFood) {

    return this.http.post(
      `https://food-picker-e8a62-default-rtdb.europe-west1.firebasedatabase.app/foodsEaten.json`,
      JSON.stringify(foodWithoutID),
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }

  removeFoodEaten(food: Food) {
    return this.http.delete(
      //?auth=${this.token}
      `https://food-picker-e8a62-default-rtdb.europe-west1.firebasedatabase.app/foodsEaten/${food.id}.json`,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }

  getFoodsEaten(): Observable<Food[]> {
    return this.http.get<Food[]>(
      'https://food-picker-e8a62-default-rtdb.europe-west1.firebasedatabase.app/foodsEaten.json', 
    );
  }
}
