import { Component, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridOptions } from 'ag-grid-community';
import { NameRendererComponent } from 'src/app/ag-grid/renderers/name-renderer/name-renderer.component';
import { RankingRendererComponent } from 'src/app/ag-grid/renderers/ranking-renderer/ranking-renderer.component';
import { convertFoodToAddFood, emptyFood, Food } from 'src/app/model/IFood';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-food-diary',
  templateUrl: './food-diary.component.html',
  styleUrls: ['./food-diary.component.scss']
})
export class FoodDiaryComponent implements OnInit {

  data = [
    {
      "value": 20,
      "date": "2020-05-12T12:19:00+00:00"
    },
    {
      "value": 50,
      "date": "2020-05-14T12:19:00+00:00"
    },
    {
      "value": 30,
      "date": "2020-05-16T12:19:00+00:00"
    },
    {
      "value": 80,
      "date": "2020-05-18T12:19:00+00:00"
    },
    {
      "value": 55,
      "date": "2020-05-20T12:19:00+00:00"
    },
    {
      "value": 60,
      "date": "2020-05-22T12:19:00+00:00"
    },
    {
      "value": 45,
      "date": "2020-05-24T12:19:00+00:00"
    },
    {
      "value": 30,
      "date": "2020-05-26T12:19:00+00:00"
    },
    {
      "value": 40,
      "date": "2020-05-28T12:19:00+00:00"
    },
    {
      "value": 70,
      "date": "2020-05-30T12:19:00+00:00"
    },
    {
      "value": 63,
      "date": "2020-06-01T12:19:00+00:00"
    },
    {
      "value": 40,
      "date": "2020-06-03T12:19:00+00:00"
    },
    {
      "value": 50,
      "date": "2020-06-05T12:19:00+00:00"
    },
    {
      "value": 75,
      "date": "2020-06-07T12:19:00+00:00"
    },
    {
      "value": 20,
      "date": "2020-06-09T12:19:00+00:00"
    },
    {
      "value": 50,
      "date": "2020-06-11T12:19:00+00:00"
    },
    {
      "value": 80,
      "date": "2020-06-13T12:19:00+00:00"
    },
    {
      "value": 75,
      "date": "2020-06-15T12:19:00+00:00"
    },
    {
      "value": 82,
      "date": "2020-06-17T12:19:00+00:00"
    },
    {
      "value": 55,
      "date": "2020-06-19T12:19:00+00:00"
    },
    {
      "value": 35,
      "date": "2020-06-21T12:19:00+00:00"
    },
    {
      "value": 34,
      "date": "2020-06-23T12:19:00+00:00"
    },
    {
      "value": 45,
      "date": "2020-06-25T12:19:00+00:00"
    },
    {
      "value": 58,
      "date": "2020-06-27T12:19:00+00:00"
    },
    {
      "value": 34,
      "date": "2020-06-29T12:19:00+00:00"
    },
    {
      "value": 60,
      "date": "2020-07-01T12:19:00+00:00"
    },
    {
      "value": 75,
      "date": "2020-07-03T12:19:00+00:00"
    },
    {
      "value": 80,
      "date": "2020-07-05T12:19:00+00:00"
    },
    {
      "value": 29,
      "date": "2020-07-07T12:19:00+00:00"
    },
    {
      "value": 40,
      "date": "2020-07-09T12:19:00+00:00"
    },
    {
      "value": 54,
      "date": "2020-07-11T12:19:00+00:00"
    },
    {
      "value": 67,
      "date": "2020-07-13T12:19:00+00:00"
    },
    {
      "value": 90,
      "date": "2020-07-15T12:19:00+00:00"
    },
    {
      "value": 84,
      "date": "2020-07-17T12:19:00+00:00"
    },
    {
      "value": 43,
      "date": "2020-07-19T12:19:00+00:00"
    }
  ]

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getFoodsEaten().subscribe(
      (data) => {
        const foods: Food[] = [];
        for (const key in data) {
          const food: Food = {
            ...emptyFood(),
            id: key,
            ...data[key]
          };

          if (new Date(food.availableExpiry) < new Date()) {
            food.available = true;
          }

          foods.push(food);
        }
  
        this.allFoodsEaten = foods;

        const DAY = 86400000; // 1 day in milliseconds
        const today4AM = new Date(new Date().setUTCHours(4,0,0,0));
        const tomorrow4AM = new Date(new Date(new Date().setUTCHours(4,0,0,0)).getTime() + DAY);

        this.foodsEatenToday = foods.filter((food) => new Date(food.dateEaten) < tomorrow4AM && new Date(food.dateEaten) > today4AM);

        // Sort the foods by date eaten
        this.allFoodsEaten.sort((a: Food, b: Food) => a.dateEaten < b.dateEaten ? -1 : 1);
        console.log('sorted foods eaten: ', this.allFoodsEaten);

        // Find the total calories for each day
        let startDate: Date = new Date((Math.floor( new Date(this.allFoodsEaten[0].dateEaten).getTime() / DAY )) * DAY);
        console.log('startDate: ', startDate);
        let endDate: Date = new Date(startDate.getTime() + DAY);
        console.log('endDate: ', endDate);
        let caloriesCurrentDay = 0;
        const caloriesPerDay = [];

        this.allFoodsEaten.forEach(food => {
          if (new Date(food.dateEaten) > startDate && new Date(food.dateEaten) < endDate) {
            caloriesCurrentDay += food.totalCalories * food.foodFraction;
          } else {
            caloriesPerDay.push({
              value: caloriesCurrentDay,
              date: startDate.toISOString()
            });

            caloriesCurrentDay = food.totalCalories * food.foodFraction;

            startDate = new Date(startDate.getTime() + DAY);
            endDate = new Date(endDate.getTime() + DAY);
          }
        })
        this.data = caloriesPerDay;

        this.caloriesToday = 0;
        this.foodsEatenToday.forEach(food => {
          this.caloriesToday += food.totalCalories*food.foodFraction;
        })

        this.agGridEatenFoods.api.sizeColumnsToFit();

      },
      (error) => {
        console.error(error);
      }
    )

    this.apiService.getChosenFoods().subscribe(
      (data) => {
        const foods = [];
        for (const key in data) {
          const food: Food = {
            ...emptyFood(),
            id: key,
            ...data[key]
          };

          if (new Date(food.availableExpiry) < new Date()) {
            food.available = true;
          }

          foods.push(food);
        }
  
        this.chosenFoods = foods;

        this.agGridEatenFoods.api.sizeColumnsToFit();
        this.agGridChosenFoods.api.sizeColumnsToFit();

      },
      (error) => {
        console.error(error);
      }
    )
  }

  public totalCaloriesBetweenDates(start: Date, end: Date) {

  }

  public caloriesToday;
  allFoodsEaten: Food[] = [];
  foodsEatenToday: Food[] = [];
  chosenFoods: Food[] = [];
  fractionEaten;

  frameworkComponents = {
    nameRenderer: NameRendererComponent,
    timesEatenRenderer: RankingRendererComponent
  };

  @ViewChild('agGridEatenFoods') agGridEatenFoods!: AgGridAngular;
  @ViewChild('agGridChosenFoods') agGridChosenFoods!: AgGridAngular;
  
  defaultColDef: ColDef = {
    flex: 1,
    sortable: true,
    filter: true,
    resizable: true
  };

  columnDefs: ColDef[] = [
    { field: 'name', editable: true, minWidth: 300, checkboxSelection: true, cellRenderer: "nameRenderer" },
    { field: 'proteinPer100Calorie', editable: true },
    { field: 'foodFraction', editable: true },
    { field: 'totalCalories', editable: true },
    { field: 'totalProtein', editable: true },
    { field: 'poundsPer1000Calories', editable: true },
    { field: 'rankWeighting', editable: true },
    { field: 'price', editable: true },
    { field: 'timesEaten', editable: true, cellRenderer: "timesEatenRenderer" },
    { field: 'ignore', editable: true },
    { field: 'available', editable: true },
  ];

  gridOptions: GridOptions = {
    rowClassRules: {
      'rated-before': params => params.api.getValue('rankWeighting', params.node) != 0,
    },
    // onCellEditingStopped: (event) => {
    //   const DAY = 86400000; // 1 day in milliseconds
    //   const food: Food = event.node.data;

    //   if (event.column.getColId() === "available") {
    //     console.log('event.column: ', event.column);
    //     if (event.oldValue) {
    //       food.availableExpiry = new Date(Date.now() + 6*DAY).toISOString();
    //       food.available = false;
    //     }
    //   }

    //   // this.apiService.updateFood(food).subscribe(
    //   //   () => {
    //   //     console.log('food updated');
    //   //   },
    //   //   (err) => {
    //   //     console.error('Failed to update food: ', err);
    //   //   }
    //   // );
    // },
  }

  setFoodAsEaten() {
    const selectedNodes = this.agGridChosenFoods.api.getSelectedNodes();
    const selectedFoods: Food[] = selectedNodes.map(node => {
      return node.data;
    });

    selectedFoods.forEach(food => {
      const index = this.chosenFoods.findIndex(f => food.id === f.id);
      const foodEaten = food;
      foodEaten.foodFraction = this.fractionEaten;
      foodEaten.dateEaten = new Date().toISOString();
      this.foodsEatenToday.push(foodEaten);
      this.apiService.addFoodEaten(convertFoodToAddFood(food)).subscribe();
    });

    this.agGridEatenFoods.api.setRowData(this.foodsEatenToday);

    this.caloriesToday = 0;
    this.foodsEatenToday.forEach(food => {
      this.caloriesToday += food.totalCalories*food.foodFraction;
    })
  }

  setFoodAsNotEaten() {
    const selectedNodes = this.agGridEatenFoods.api.getSelectedNodes();
    const selectedFoods: Food[] = selectedNodes.map(node => {
      return node.data;
    });

    selectedFoods.forEach(food => {
      this.apiService.removeFoodEaten(food).subscribe();
    });
  }

  // Only show todays eaten foods
}
