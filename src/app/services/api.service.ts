import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { convertChosenFoodToNewChosenFood, IChosenFood, INewChosenFood } from '../model/IChosenFood';
import { IEatenFood, INewEatenFood } from '../model/IEatenFood';
import { IFood, INewFood, convertFoodToNewFood } from '../model/IFood';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  // Foods
  getFoods(): Observable<Object[]> {
    return this.http.get<Object[]>(
      'https://food-picker-e8a62-default-rtdb.europe-west1.firebasedatabase.app/foods.json', 
    );
  }

  updateFood(food: IFood) {
    const foodWithoutID: INewFood = convertFoodToNewFood(food);
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

  addFood(foodWithoutID: INewFood) {
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

  deleteFood(food: IFood) {
    return this.http.delete(
      //?auth=${this.token}
      `https://food-picker-e8a62-default-rtdb.europe-west1.firebasedatabase.app/foods/${food.id}.json`,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }
  ////////////////////

  // Chosen Foods
  getChosenFoods(): Observable<Object[]> {
    return this.http.get<Object[]>(
      'https://food-picker-e8a62-default-rtdb.europe-west1.firebasedatabase.app/chosenFoods.json', 
    );
  }

  clearChosenFoods(): Observable<IChosenFood[]> {
    return this.http.delete<IChosenFood[]>(
      'https://food-picker-e8a62-default-rtdb.europe-west1.firebasedatabase.app/chosenFoods.json', 
    );
  }

  addChosenFood(newChosenFood: INewChosenFood) {
    return this.http.post(
      `https://food-picker-e8a62-default-rtdb.europe-west1.firebasedatabase.app/chosenFoods.json`,
      JSON.stringify(newChosenFood),
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }

  removeChosenFood(chosenFood: IFood) {
    return this.http.delete(
      //?auth=${this.token}
      `https://food-picker-e8a62-default-rtdb.europe-west1.firebasedatabase.app/chosenFoods/${chosenFood.id}.json`,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }

  updateChosenFood(chosenFood: IChosenFood) {
    const newChosenFood: INewChosenFood = convertChosenFoodToNewChosenFood(chosenFood);
    return this.http.put(
      //?auth=${this.token}
      `https://food-picker-e8a62-default-rtdb.europe-west1.firebasedatabase.app/chosenFoods/${chosenFood.id}.json`,
      JSON.stringify(newChosenFood),
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }
  ///////////////////

  // Foods Eaten
  addFoodEaten(foodWithoutID: INewEatenFood) {
    return this.http.post(
      `https://food-picker-e8a62-default-rtdb.europe-west1.firebasedatabase.app/foodsEaten.json`,
      JSON.stringify(foodWithoutID),
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    ).pipe(
      // Update food if successfully added new food eaten
      map(response => {

      })
    )
  }

  removeFoodEaten(food: IEatenFood) {
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

  getFoodsEaten(): Observable<Object[]> {
    return this.http.get<Object[]>(
      'https://food-picker-e8a62-default-rtdb.europe-west1.firebasedatabase.app/foodsEaten.json', 
    );
  }
  //////////////
}
