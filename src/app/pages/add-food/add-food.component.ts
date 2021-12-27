import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { emptyFood, IFoodForm } from 'src/app/model/IFood';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-add-food',
  templateUrl: './add-food.component.html',
  styleUrls: ['./add-food.component.scss']
})
export class AddFoodComponent implements OnInit {

  // Component State
  public questionForm: IFoodForm = this.fb.group(emptyFood());

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
    ) { }

  ngOnInit(): void {
  }

  addFood = () => {
    const food = emptyFood();
    const foodFormValues = this.questionForm.value;
    food.name = foodFormValues.name;
    food.url = foodFormValues.url;
    food.totalCalories = Number(foodFormValues.totalCalories);
    food.totalProtein = Number(foodFormValues.totalProtein);
    food.rankWeighting = Number(foodFormValues.rankWeighting);
    food.timesEaten = Number(foodFormValues.timesEaten);
    food.price = Number(foodFormValues.price);

    food.proteinPer100Calorie = Number((food.totalProtein/food.totalCalories)*100);
    food.poundsPer1000Calories = Number((food.price/food.totalCalories)*1000);
    
    console.log(food);
    this.apiService.addFood(food).subscribe(
      () => {
        console.log('Added food');
      },
      (err) => {
        console.error('Failed to add food: ', err);
      }
    );
  }
}
