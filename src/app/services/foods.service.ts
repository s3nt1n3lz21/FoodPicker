import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { emptyIChosenFood, IChosenFood } from "../model/IChosenFood";
import { ApiService } from "./api.service";
import { emptyIFood, IFood } from "../model/IFood";
import { catchError, map, tap} from "rxjs/operators";
import { emptyIEatenFood, IEatenFood } from "../model/IEatenFood";

@Injectable({
    providedIn: 'root'
})
export class FoodsService {

    private _foods: IFood[] = [];
	private _chosenFoods: IChosenFood[] = [];
    private _eatenFoods: IEatenFood[] = [];
  
    private _foodsSubject: BehaviorSubject<IFood[]> = new BehaviorSubject<IFood[]>(this._foods);
	private _chosenFoodsSubject: BehaviorSubject<IChosenFood[]> = new BehaviorSubject<IChosenFood[]>(this._chosenFoods);
    private _eatenFoodsSubject: BehaviorSubject<IEatenFood[]> = new BehaviorSubject<IEatenFood[]>(this._eatenFoods)

	private _callAPI: Map<string, boolean> = new Map<string, boolean>(
		[
			['getChosenFoods', true],
            ['getFoods', true],
            ['eatenFoods', true]
		]
	);

	constructor(
        private readonly _apiService: ApiService,
    ) {}

    public callAPIsAgain() {
		this._callAPI.forEach((callAPI) => {
			callAPI = true;
		});
	}

    public setFoods(value: IFood[]) {
        this._foods = value;
        this._foodsSubject.next(this._foods);
    }

    public getFoods(): Observable<IFood[]> {
        // If haven't called API, call the API and store results in the service
		if (this._callAPI.get('getFoods')) {
			return this._apiService.getFoods()
				.pipe(
					map(response => {
                            const foods: IFood[] = [];
                            for (const key in response) {
                                const food: IFood = {
                                ...emptyIFood(),
                                id: key,
                                ...response[key]
                                };
                    
                                if (new Date(food.availableExpiry) < new Date()) {
                                    food.availableToBuy = true;
                                }
                    
                                foods.push(food);
                            }
                            return foods;
                        }
                    ),
					tap((foods) => {
						this._callAPI.set('getFoods', false),
						this.setFoods(foods);
					}),
					catchError(error => throwError(error)),
				);
		} else {
			return this._foodsSubject.asObservable();
		}
    }

    public setChosenFoods(value: IChosenFood[]) {
        this._chosenFoods = value;
        this._chosenFoodsSubject.next(this._chosenFoods);
    }

    public getChosenFoods(): Observable<IChosenFood[]> {
        // If haven't called API, call the API and store results in the service
		if (this._callAPI.get('getChosenFoods')) {
			return this._apiService.getChosenFoods()
				.pipe(
					map(response => {
                            const chosenFoods: IChosenFood[] = [];
                            for (const key in response) {
                                const chosenFood: IChosenFood = {
                                ...emptyIChosenFood(),
                                id: key,
                                ...response[key]
                                };
                    
                                if (new Date(chosenFood.food.availableExpiry) < new Date()) {
                                    chosenFood.food.availableToBuy = true;
                                }
                    
                                chosenFoods.push(chosenFood);
                            }
                            return chosenFoods;
                        }
                    ),
					tap((chosenFoods) => {
						this._callAPI.set('getReportMappings', false),
						this.setChosenFoods(chosenFoods);
					}),
					catchError(error => throwError(error)),
				);
		} else {
			return this._chosenFoodsSubject.asObservable();
		}
    }

    public setEatenFoods(value: IEatenFood[]) {
        this._eatenFoods = value;
        this._eatenFoodsSubject.next(this._eatenFoods);
    }

    public getEatenFoods(): Observable<IEatenFood[]> {
        // If haven't called API, call the API and store results in the service
		if (this._callAPI.get('getEatenFoods')) {
			return this._apiService.getFoodsEaten()
				.pipe(
					map(response => {
                            const eatenFoods: IEatenFood[] = [];
                            for (const key in response) {
                                const eatenFood: IEatenFood = {
                                ...emptyIEatenFood(),
                                id: key,
                                ...response[key]
                                };
                    
                                if (new Date(eatenFood.food.availableExpiry) < new Date()) {
                                    eatenFood.food.availableToBuy = true;
                                }
                    
                                eatenFoods.push(eatenFood);
                            }
                            return eatenFoods;
                        }
                    ),
					tap((eatenFoods) => {
						this._callAPI.set('getEatenFoods', false),
						this.setEatenFoods(eatenFoods);
					}),
					catchError(error => throwError(error)),
				);
		} else {
			return this._eatenFoodsSubject.asObservable();
		}
    }
}
