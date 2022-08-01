import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { INewFood, emptyINewFood, emptyIFood, IFoodForm } from 'src/app/model/IFood';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-add-food',
  templateUrl: './add-food.component.html',
  styleUrls: ['./add-food.component.scss']
})
export class AddFoodComponent implements OnInit {

  // Component State
  public questionForm: IFoodForm = this.fb.group(emptyIFood());

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
    ) { }

  ngOnInit(): void {
  }

  addFood = () => {
    const food: INewFood = emptyINewFood();
    const foodFormValues = this.questionForm.value;
    food.name = foodFormValues.name;
    food.url = foodFormValues.url;
    food.nutritionalInformation.totalCalories = Number(foodFormValues.nutritionalInformation.totalCalories);
    food.nutritionalInformation.totalProtein = Number(foodFormValues.nutritionalInformation.totalProtein);
    food.rank = Number(foodFormValues.rank);
    food.timesEaten = Number(foodFormValues.timesEaten);
    food.price = Number(foodFormValues.price);

    food.ratios.proteinPer100Calories = Number((food.nutritionalInformation.totalProtein/food.nutritionalInformation.totalCalories)*100);
    food.ratios.poundsPer1000Calories = Number((food.price/food.nutritionalInformation.totalCalories)*1000);
    
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
