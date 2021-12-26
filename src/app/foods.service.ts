import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class FoodsService {
    foods;

    constructor(
        private http: HttpClient
    ) {
    }

    public loadFoods() {
        return this.http.get("/Foods.csv", { responseType: 'text' })
    }

}