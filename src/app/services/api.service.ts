import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
  getFoods(): Observable<IFood[]> {
    return this.http.get<IFood[]>(
      'https://food-picker-e8a62-default-rtdb.europe-west1.firebasedatabase.app/foods.json', 
    );
  }

  updateFood(food: IFood): Observable<IFood> {
    const foodWithoutID: INewFood = convertFoodToNewFood(food);
    return this.http.put<IFood>(
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

  addFood(foodWithoutID: INewFood): Observable<IFood> {
    return this.http.post<IFood>(
      `https://food-picker-e8a62-default-rtdb.europe-west1.firebasedatabase.app/foods.json`,
      JSON.stringify(foodWithoutID),
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }

  deleteFood(id: string) {
    return this.http.delete(
      //?auth=${this.token}
      `https://food-picker-e8a62-default-rtdb.europe-west1.firebasedatabase.app/foods/${id}.json`,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }
  ////////////////////

  // Chosen Foods
  getChosenFoods(): Observable<IChosenFood[]> {
    return this.http.get<IChosenFood[]>(
      'https://food-picker-e8a62-default-rtdb.europe-west1.firebasedatabase.app/chosenFoods.json', 
    );
  }

  clearChosenFoods() {
    return this.http.delete(
      'https://food-picker-e8a62-default-rtdb.europe-west1.firebasedatabase.app/chosenFoods.json', 
    );
  }

  addChosenFood(newChosenFood: INewChosenFood): Observable<IChosenFood> {
    return this.http.post<IChosenFood>(
      `https://food-picker-e8a62-default-rtdb.europe-west1.firebasedatabase.app/chosenFoods.json`,
      JSON.stringify(newChosenFood),
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }

  deleteChosenFood(id: string) {
    return this.http.delete(
      //?auth=${this.token}
      `https://food-picker-e8a62-default-rtdb.europe-west1.firebasedatabase.app/chosenFoods/${id}.json`,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }

  updateChosenFood(chosenFood: IChosenFood): Observable<IChosenFood> {
    const newChosenFood: INewChosenFood = convertChosenFoodToNewChosenFood(chosenFood);
    return this.http.put<IChosenFood>(
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
  addEatenFood(foodWithoutID: INewEatenFood): Observable<IEatenFood> {
    return this.http.post<IEatenFood>(
      `https://food-picker-e8a62-default-rtdb.europe-west1.firebasedatabase.app/foodsEaten.json`,
      JSON.stringify(foodWithoutID),
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }

  deleteEatenFood(id: string) {
    return this.http.delete(
      //?auth=${this.token}
      `https://food-picker-e8a62-default-rtdb.europe-west1.firebasedatabase.app/foodsEaten/${id}.json`,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }

  getEatenFoods(): Observable<IEatenFood[]> {
    return this.http.get<IEatenFood[]>(
      'https://food-picker-e8a62-default-rtdb.europe-west1.firebasedatabase.app/foodsEaten.json', 
    );
  }
  //////////////
}
