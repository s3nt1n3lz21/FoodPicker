import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridOptions } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { NameRendererComponent } from 'src/app/ag-grid/renderers/name-renderer/name-renderer.component';
import { RankingRendererComponent } from 'src/app/ag-grid/renderers/ranking-renderer/ranking-renderer.component';
import { Food, emptyFood, AddFood, emptyAddFood, convertFoodToAddFood } from 'src/app/model/IFood';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-food-list',
  templateUrl: './food-list.component.html',
  styleUrls: ['./food-list.component.scss']
})
export class FoodListComponent implements OnInit {

  title = 'food-picker';
  chosenFoods: Food[] = [];
  matchingFoods: Food[] = [];
  search = "";

  headings = Object.keys(emptyFood()); // headings
  foods: Food[] = []; // foods

  suggestedFoods: Food[] = [];
  caloriesPerDay = 1400;

  totalPrice = 0;
  totalProtein = 0;
  totalCalories = 0;
  totalProteinPerDay = 0;

  averageReqProteinPerCalorie = 0;

  daysFood = 0;
  ignoreIndex = -1;

  constructor(private apiService: ApiService,
    private http: HttpClient) { 
    // this.rowData = this.http.get<any[]>('https://www.ag-grid.com/example-assets/row-data.json');
  }

  ngOnInit() {
    this.refreshFoodsList();
    this.refreshChosenFoods();
  }

  public loadCSV(files: FileList) {
    console.log(files);
    if (files && files.length > 0) {
      let file: File = files.item(0);
      console.log(file.name);
      console.log(file.size);
      console.log(file.type);
      //File reader method
      let reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        // Get all the text
        let csv: any = reader.result;
        let allTextLines = [];
        allTextLines = csv.split(/\r|\n|\r/);

        //Table Headings
        let headers = allTextLines[0].split(',');
        let data = headers;
        let tarr = [];
        for (let j = 0; j < headers.length; j++) {
          tarr.push(data[j]);
        }
        this.headings = headers;

        // Table foods
        let arrl = allTextLines.length;
        let newFoods: AddFood[] = [];
        let keys: string[] = Object.keys(emptyAddFood());
        for (let i = 1; i < arrl; i++) {
          const row = allTextLines[i];
          if (row) {
            const newFood: AddFood = emptyAddFood();
            const valuesToAdd: string[] = row.split(',');
            keys.forEach((key, index) => {
              if (typeof newFood[key] === 'string') {
                newFood[key] = valuesToAdd[index];
              } else if (typeof newFood[key] === 'number') {
                newFood[key] = Number(valuesToAdd[index]);
              }
              
            })
            newFoods.push(newFood);
          }
        }

        newFoods.forEach(food => {
          this.apiService.addFood(food).subscribe(() => {});
        })
      }
    }
  }

  public recalculateNumbers() {
    let allPickedFoods = this.suggestedFoods.concat(this.chosenFoods);
    this.totalPrice = this.getTotalPrice(allPickedFoods);
    this.totalProtein = this.getTotalProtein(allPickedFoods);
    this.totalCalories = this.getTotalCalories(allPickedFoods);
    this.daysFood = this.totalCalories / this.caloriesPerDay;
    this.totalProteinPerDay = this.totalProtein / this.daysFood;
  }

  public clearAllFoods() {
    this.suggestedFoods = [];
    this.chosenFoods = [];
    this.recalculateNumbers();
  }

  public clearChosenFoods() {
    this.chosenFoods = [];
    this.apiService.clearChosenFoods().subscribe();
  }

  public clearSuggestedFoods() {
    this.suggestedFoods = [];
    this.recalculateNumbers();
  }

  public pickSuggestedFoods() {

    let allPickedFoods = [];

    // Get enough foods for min shop
    let limit = 0;
    while (this.totalPrice < 40 && limit < 100) {
      const food = this.getRandomValidFood();
      this.suggestedFoods.push(food);
      allPickedFoods = this.suggestedFoods.concat(this.chosenFoods);
      this.totalPrice = this.getTotalPrice(allPickedFoods);
      limit += 1;
    }

    this.recalculateNumbers();

    this.recalculateFoods();

    console.log('suggested foods: ', this.suggestedFoods);

    this.agGridSuggestedFoods.api.setRowData(this.suggestedFoods);
  }

  // Keep replacing foods until conditions met
  public recalculateFoods() {
    // If total protein < 120g per day
    const maxLoops = 1000;
    let numLoops = 0;
    // let maxProtein = 2.2 * 58; 127.6
    let maxProtein = 60;
    this.averageReqProteinPerCalorie = (maxProtein/this.caloriesPerDay)*100;
    while ((this.totalProteinPerDay < maxProtein || this.daysFood < 7) && numLoops < maxLoops) {
      // get lowest protein food and replace with random food
      const lowestIndex = this.findLowestProteinFood(this.suggestedFoods);
      this.suggestedFoods[lowestIndex] = this.getRandomValidFood();

      this.recalculateNumbers();

      numLoops += 1;
    }

    if (numLoops === maxLoops) {
      console.log('Failed to follow conditions');
    }
  }

  public addRandomFood() {
    this.suggestedFoods.push(this.getRandomValidFood());
    this.suggestedFoods.sort((a, b) => a.proteinPer100Calorie > b.proteinPer100Calorie ? -1 : 1)
  }

  public getRandomValidFood() {
    // keep getting a random food thats available

    let food = this.getRandomFood();
    let foodAvailable = food.available;
    let ignoreFood = food.ignore;
    let poundsPer1000Calorie = food.poundsPer1000Calories;
    let rank = food.rankWeighting*1;
    let proteinPer100Calorie = food.proteinPer100Calorie;

    // get another food if food not available, or ignoring food, or costs too much
    // ~ 1400 calories a day ~ 10000 calories every 7 days. £70 per 10000 calories
    let limit = 0;
    while ((!foodAvailable || ignoreFood || poundsPer1000Calorie > 6.3 || proteinPer100Calorie < 4.8 || rank == -1 || rank == 1) && limit < 20000) {
      food = this.getRandomFood();
      foodAvailable = food.available;
      ignoreFood = food.ignore;
      poundsPer1000Calorie = food.poundsPer1000Calories;
      proteinPer100Calorie = food.proteinPer100Calorie;
      rank = food.rankWeighting*1;
      limit += 1;
    }

    if (limit === 20000) {
      console.log('failed to follow conditions');
    }

    return food;
  }

  public getRandomFood() {
    return this.foods[Math.floor((Math.random() * this.foods.length))];
  }

  public findLowestProteinFood(foods: Food[]) {
    let tempProtein;
    let lowestProtein = Number.POSITIVE_INFINITY;
    let lowestIndex = 0;
    for (let index = foods.length - 1; index >= 0; index--) {
      tempProtein = foods[index].proteinPer100Calorie;
      if (tempProtein < lowestProtein) {
        lowestProtein = tempProtein;
        lowestIndex = index;
      }
    }

    return lowestIndex;
  }

  public getTotalProtein(foods: Food[]) {
    let totalProtein = 0;
    for (let index = foods.length - 1; index >= 0; index--) {
      let protein = foods[index].totalProtein;
      if (!isNaN(protein)) {
        totalProtein += protein;
      }
    }

    return totalProtein;
  }

  public getTotalCalories(foods: Food[]) {
    let totalCalories = 0;
    for (let index = foods.length - 1; index >= 0; index--) {
      let calories = foods[index].totalCalories;
      if (!isNaN(calories)) {
        totalCalories += calories;
      }
    }

    return totalCalories;
  }

  public getTotalPrice(foods: Food[]) {
    let totalPrice = 0;
    for (let index = foods.length - 1; index >= 0; index--) {
      let price = foods[index].price;
      if (!isNaN(price)) {
        totalPrice += price;
      }
    }

    return totalPrice;
  }

  public chooseFoods() {
    const selectedNodes = this.agGridSuggestedFoods.api.getSelectedNodes();
    const selectedFoods: Food[] = selectedNodes.map(node => {
      return node.data;
    });

    selectedFoods.forEach(food => {
      const index = this.suggestedFoods.findIndex(f => food.databaseID === f.databaseID);
      this.suggestedFoods.splice(index, 1);
      this.chosenFoods.push(food);
      this.apiService.addChosenFood(convertFoodToAddFood(food)).subscribe();
    });

    this.agGridChosenFoods.api.setRowData(this.chosenFoods);
    this.agGridSuggestedFoods.api.removeItems(selectedNodes);
  }

  public replaceSuggestedFoods() {
    // Remove the suggested foods and add replace with random foods
    const selectedNodes = this.agGridSuggestedFoods.api.getSelectedNodes();
    selectedNodes.forEach(node => {
      const food: Food = node.data;
      const index = this.suggestedFoods.findIndex((f) => f.databaseID === food.databaseID)
      if (index) {
        this.suggestedFoods.splice(index, 1);
        this.suggestedFoods.push(this.getRandomValidFood());
      }
    });

    this.agGridSuggestedFoods.api.setRowData(this.suggestedFoods);

    this.recalculateNumbers();
    this.recalculateFoods();
  }

  public removeFoods() {
    // Remove the selected suggested foods from the list
    const selectedNodes = this.agGridSuggestedFoods.api.getSelectedNodes();
    selectedNodes.forEach(node => {
      const food: Food = node.data;
      const index = this.suggestedFoods.findIndex((f) => f.databaseID === food.databaseID)
      if (index) {
        this.suggestedFoods.splice(index, 1);
      }
    });

    this.agGridSuggestedFoods.api.setRowData(this.suggestedFoods);

    this.recalculateNumbers();
    this.recalculateFoods();
  }

  public notAvailable() {
    // Set the food availability to false and remove the food from the list
    const selectedNodes = this.agGridSuggestedFoods.api.getSelectedNodes()
    selectedNodes.forEach(node => {
      const data: Food = node.data;
      const index = this.suggestedFoods.findIndex((f) => f.databaseID === data.databaseID)
      if (index) {
        this.suggestedFoods[index].available = false;
        this.suggestedFoods.splice(index, 1);
      }

      const index2 = this.chosenFoods.findIndex((f) => f.databaseID === data.databaseID)
      if (index2) {
        this.chosenFoods[index2].available = false;
        this.chosenFoods.splice(index2, 1);
      }

      const index3 = this.matchingFoods.findIndex((f) => f.databaseID === data.databaseID)
      if (index3) {
        this.matchingFoods[index3].available = false;
        this.matchingFoods.splice(index3, 1);
      }
    });

    // Replace with a random food
    this.suggestedFoods.push(this.getRandomValidFood());

    this.recalculateNumbers();
    this.recalculateFoods();
  }

  public searchFood(searchString: string) {
    this.matchingFoods = this.foods.filter((f) => f.name.includes(searchString));
    this.agGridMatchingFoods.api.setRowData(this.matchingFoods);
  }

  public addSearchedFoods() {
    // Get the selected searched foods and add them to chosen foods
    const selectedNodes = this.agGridMatchingFoods.api.getSelectedNodes();
    selectedNodes.forEach(node => {
      const food: Food = node.data;
      this.chosenFoods.push(food);
      this.apiService.addChosenFood(convertFoodToAddFood(food)).subscribe();
    });

    this.agGridChosenFoods.api.setRowData(this.chosenFoods);


    this.recalculateNumbers();
    this.recalculateFoods();
  }

  public purchasedFoods() {
    // For each chosen food increase timesEaten by 1
    // this.chosenFoods.forEach()
  }

  public removeChosenFoods() {
    const selectedNodes = this.agGridChosenFoods.api.getSelectedNodes();
    selectedNodes.forEach(node => {
      const food: Food = node.data;
      this.chosenFoods = this.chosenFoods.filter(f => f.databaseID != food.databaseID);
      this.apiService.removeChosenFood(food).subscribe();
    });
  }

  public deleteFoods() {
    const selectedNodesChosenFoods = this.agGridChosenFoods.api.getSelectedNodes();
    selectedNodesChosenFoods.forEach(node => {
      const food: Food = node.data;
      this.chosenFoods = this.chosenFoods.filter(f => f.databaseID != food.databaseID);
      this.apiService.deleteFood(food).subscribe();
    });

    const selectedNodesMatchingFoods = this.agGridMatchingFoods.api.getSelectedNodes();
    selectedNodesMatchingFoods.forEach(node => {
      const food: Food = node.data;
      this.chosenFoods = this.chosenFoods.filter(f => f.databaseID != food.databaseID);
      this.apiService.deleteFood(food).subscribe(
        () => {
          this.searchFood(this.search);
        }
      );
    });

    const selectedNodesSuggestedFoods = this.agGridSuggestedFoods.api.getSelectedNodes();
    selectedNodesSuggestedFoods.forEach(node => {
      const food: Food = node.data;
      this.chosenFoods = this.chosenFoods.filter(f => f.databaseID != food.databaseID);
      this.apiService.deleteFood(food).subscribe();
    });
  }

  public refreshFoodsList() {
    this.apiService.getFoods().subscribe(
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
  
        this.foods = foods;
        this.searchFood(this.search);
      },
      (error) => {
        console.error(error);
      }
    )
  }

  public refreshChosenFoods() {
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

  rowData: Observable<any[]>;
  @ViewChild('agGridMatchingFoods') agGridMatchingFoods!: AgGridAngular;
  @ViewChild('agGridChosenFoods') agGridChosenFoods!: AgGridAngular;
  @ViewChild('agGridSuggestedFoods') agGridSuggestedFoods!: AgGridAngular;

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

  frameworkComponents = {
    nameRenderer: NameRendererComponent,
    timesEatenRenderer: RankingRendererComponent
  };

  gridOptions: GridOptions = {
    rowClassRules: {
      'rated-before': params => params.api.getValue('rankWeighting', params.node) != 0,
    },
    onCellEditingStopped: (event) => {
      const DAY = 86400000; // 1 day in milliseconds
      const food: Food = event.node.data;

      if (event.column.getColId() === "available") {
        console.log('event.column: ', event.column);
        if (event.oldValue) {
          food.availableExpiry = new Date(Date.now() + 6*DAY).toISOString();
          food.available = false;
        }
      }

      this.apiService.updateFood(food).subscribe(
        () => {
          console.log('food updated');
        },
        (err) => {
          console.error('Failed to update food: ', err);
        }
      );
    },
  }

}
