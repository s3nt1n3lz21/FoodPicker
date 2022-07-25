import { Component, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridOptions } from 'ag-grid-community';
import { forkJoin } from 'rxjs';
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

  data;
  proteinData;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.refreshEatenFoods();
    this.refreshChosenFoods();
  }

  public caloriesToday;
  public proteinToday;
  public averageCaloriesLastWeek;
  public averageProteinLastWeek;
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
  }

  setFoodAsEaten() {
    const selectedNodes = this.agGridChosenFoods.api.getSelectedNodes();
    const selectedFoods: Food[] = selectedNodes.map(node => {
      return node.data;
    });

    selectedFoods.forEach(food => {
      const foodEaten = food;
      foodEaten.foodFraction = this.fractionEaten;
      foodEaten.dateEaten = new Date().toISOString();
      foodEaten.timesEaten += 1;
      this.foodsEatenToday.push(foodEaten);

      forkJoin(
        [
          this.apiService.addFoodEaten(convertFoodToAddFood(food)),
          this.apiService.updateFood(foodEaten),
          this.apiService.updateChosenFood(foodEaten)
        ]
      ).subscribe(() => {
        this.agGridEatenFoods.api.setRowData(this.foodsEatenToday);

        this.caloriesToday = 0;
        this.proteinToday = 0;
        this.foodsEatenToday.forEach(food => {
          this.caloriesToday += food.totalCalories*food.foodFraction;
          this.proteinToday += food.totalProtein*food.foodFraction;
        });
    
        this.refreshChosenFoods();
        this.refreshEatenFoods();
      });
    });
  }

  setFoodAsNotEaten() {
    const selectedNodes = this.agGridEatenFoods.api.getSelectedNodes();
    const selectedFoods: Food[] = selectedNodes.map(node => {
      return node.data;
    });

    selectedFoods.forEach(food => {
      // this.apiService.removeFoodEaten(food).subscribe();
      const foodEaten = food;
      foodEaten.timesEaten -= 1;
      // this.apiService.updateFood(foodEaten)

      forkJoin(
        [
          this.apiService.removeFoodEaten(food),
          this.apiService.updateFood(foodEaten),
          this.apiService.updateChosenFood(foodEaten)
        ]
      ).subscribe(() => {
        this.refreshChosenFoods();
        this.refreshEatenFoods();
      });
    });
  }






















  /////////////////////////

  refreshChosenFoods() {
    this.apiService.getChosenFoods().subscribe(
      (data) => {
        const foods = [];
        for (const key in data) {
          const food: Food = {
            ...emptyFood(),
            databaseID: key,
            ...data[key]
          };

          if (new Date(food.availableExpiry) < new Date()) {
            food.available = true;
          }

          foods.push(food);
        }
  
        this.chosenFoods = foods;
        this.agGridChosenFoods.api.sizeColumnsToFit();

      },
      (error) => {
        console.error(error);
      }
    )
  }

  refreshEatenFoods() {
    this.apiService.getFoodsEaten().subscribe(
      (data) => {
        const foods: Food[] = [];
        for (const key in data) {
          const food: Food = {
            ...emptyFood(),
            databaseID: key,
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
        let startDate: Date = new Date((Math.floor( new Date(this.allFoodsEaten[0].dateEaten).getTime() / DAY )) * DAY + DAY/6);
        console.log('startDate: ', startDate);
        let endDate: Date = new Date(startDate.getTime() + DAY);
        console.log('endDate: ', endDate);


        let caloriesCurrentDay = 0;
        const caloriesPerDay = [];
        let proteinCurrentDay = 0;
        const proteinPerDay = [];

        this.allFoodsEaten.forEach(food => {
          if (new Date(food.dateEaten) > startDate && new Date(food.dateEaten) < endDate) {
            caloriesCurrentDay += food.totalCalories * food.foodFraction;
            proteinCurrentDay += food.totalProtein * food.foodFraction;
          } else {

            caloriesPerDay.push({
              value: caloriesCurrentDay,
              date: startDate.toISOString()
            });

            proteinPerDay.push({
              value: proteinCurrentDay,
              date: startDate.toISOString()
            });

            caloriesCurrentDay = food.totalCalories * food.foodFraction;
            proteinCurrentDay = food.totalProtein * food.foodFraction;

            startDate = new Date(startDate.getTime() + DAY);
            endDate = new Date(endDate.getTime() + DAY);
          }
        })
        
        caloriesPerDay.push({
          value: caloriesCurrentDay,
          date: startDate.toISOString()
        });

        proteinPerDay.push({
          value: proteinCurrentDay,
          date: startDate.toISOString()
        });

        this.data = caloriesPerDay;
        this.proteinData = proteinPerDay;

        this.caloriesToday = 0;
        this.proteinToday = 0;
        this.foodsEatenToday.forEach(food => {
          this.caloriesToday += food.totalCalories*food.foodFraction;
          this.proteinToday += food.totalProtein*food.foodFraction;
        })

        this.averageCaloriesLastWeek = 0;
        caloriesPerDay.slice(-7).forEach((calories) => {
          this.averageCaloriesLastWeek += calories.value;
        })
        this.averageCaloriesLastWeek /= 7;

        this.averageProteinLastWeek = 0;
        proteinPerDay.slice(-7).forEach((protein) => {
          this.averageProteinLastWeek += protein.value;
        })
        this.averageProteinLastWeek /= 7;

        this.agGridEatenFoods.api.sizeColumnsToFit();
      },
      (error) => {
        console.error(error);
      }
    )
  }
}
