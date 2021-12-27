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
  public questionForm: IFoodForm = this.fb.group({
    question: '',
    answer: '',
  });

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
    food.totalCalories = foodFormValues.totalCalories;
    food.totalProtein = foodFormValues.totalProtein;
    food.rankWeighting = foodFormValues.rankWeighting;
    food.timesEaten = foodFormValues.timesEaten;
    food.price = foodFormValues.price;
    this.apiService.addFood(food).subscribe(
      () => {
        console.log('Added food');
      },
      (err) => {
        console.error('Failed to add food: ', err);
      }
    );
  }


  // extractedPrice: '',
  // pricePerAmount: '',
  // extractedProteinPer100g: '',
  // extractedKJPer100g: '',
  // proteinPer100g: 0,
  // kJPer100g: 0,
  // caloriesPer100g: 0,
  // proteinPer100Calorie: 0,
  // poundsPerAsString: '',
  // poundsPer: 0,
  // perAmount: '',
  // poundsPer100g: 0,
  // multiplesOf100g: 0,
  // perEachPer100g: 0,
  // totalCalories: 0,
  // totalProtein: 0,
  // rankWeighting: 0,
  // poundsPer1000Calories: 0,
  // ignore: false,
}
