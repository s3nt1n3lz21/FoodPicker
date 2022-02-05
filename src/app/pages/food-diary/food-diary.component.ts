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

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getFoodsEaten().subscribe(
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
  
        this.foodsEatenToday = foods;

        this.caloriesToday = 0;
        this.foodsEatenToday.forEach(food => {
          this.caloriesToday += food.totalCalories*food.foodFraction;
        })

        console.log(this.foodsEatenToday);

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

  public caloriesToday;
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

  // Only show todays eaten foods
}