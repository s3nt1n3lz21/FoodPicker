import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridOptions, RowClassRules } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { AddFood, emptyAddFood, emptyFood, Food } from './model/IFood';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'food-picker';
  fixedFoods: Food[] = [];
  matchingFoods: Food[] = [];
  search = "";

  headings = Object.keys(emptyFood()); // headings
  foods: Food[] = []; // foods

  pickedFoods: Food[] = [];
  caloriesPerDay = 1400;

  totalPrice = 0;
  totalProtein = 0;
  totalCalories = 0;
  totalProteinPerDay = 0;

  daysFood = 0;
  ignoreIndex = -1;

  constructor(private apiService: ApiService,
    private http: HttpClient) { 
    // this.rowData = this.http.get<any[]>('https://www.ag-grid.com/example-assets/row-data.json');
  }

  ngOnInit() {
    this.apiService.getFoods().subscribe(
      (data) => {
        const foods = [];
        for (const key in data) {
          const food: Food = {
            ...emptyFood(),
            id: key,
            ...data[key]
          };

          foods.push(food);
        }
  
        this.foods = foods;
        // this.rowData = this.foods
        console.log('this.foods: ', this.foods);
        this.agGridPickedFoods.api.sizeColumnsToFit();
        this.agGridMatchingFoods.api.sizeColumnsToFit();
        this.agGridFixedFoods.api.sizeColumnsToFit();
        // Set all the foods to available
        this.foods.forEach((food) => food.available = true);
      },
      (error) => {
        console.error(error);
      }
    )
  }

  public previewFile(files: FileList) {
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

        
        console.log('adding foods: ', newFoods);


        // newFoods.forEach(food => {
        //   this.apiService.addFood(food).subscribe(() => {});
        // })
      }
    }
  }

  public recalculateNumbers() {
    let allPickedFoods = this.pickedFoods.concat(this.fixedFoods);
    this.totalPrice = this.getTotalPrice(allPickedFoods);
    this.totalProtein = this.getTotalProtein(allPickedFoods);
    this.totalCalories = this.getTotalCalories(allPickedFoods);
    this.daysFood = this.totalCalories / this.caloriesPerDay;
    this.totalProteinPerDay = this.totalProtein / this.daysFood;
  }

  public clearAllFoods() {
    this.pickedFoods = [];
    this.fixedFoods = [];
    this.recalculateNumbers();
  }

  public clearPickedFoods() {
    this.pickedFoods = [];
    this.recalculateNumbers();
  }

  public pickFoods() {

    let allPickedFoods = [];

    // Get enough foods for min shop
    let limit = 0;
    while (this.totalPrice < 40 && limit < 100) {
      const food = this.getRandomValidFood();
      this.pickedFoods.push(food);
      allPickedFoods = this.pickedFoods.concat(this.fixedFoods);
      this.totalPrice = this.getTotalPrice(allPickedFoods);
      console.log(this.totalPrice);
      limit += 1;
    }
    console.log('finished picking initial foods');

    this.recalculateNumbers();

    this.recalculateFoods();

    this.agGridPickedFoods.api.setRowData(this.pickedFoods);
  }

  // Keep replacing foods until conditions met
  public recalculateFoods() {
    // If total protein < 120g per day
    const maxLoops = 1000;
    let numLoops = 0;
    let maxProtein = 2.2 * 58;
    while ((this.totalProteinPerDay < 80 || this.daysFood < 7) && numLoops < maxLoops) {
      // get lowest protein food and replace with random food
      const lowestIndex = this.findLowestProteinFood(this.pickedFoods);
      this.pickedFoods[lowestIndex] = this.getRandomValidFood();

      this.recalculateNumbers();

      numLoops += 1;
    }
  }

  public addRandomFood() {
    this.pickedFoods.push(this.getRandomValidFood());
    this.pickedFoods.sort((a, b) => a.proteinPer100Calorie > b.proteinPer100Calorie ? -1 : 1)
  }

  public getRandomValidFood() {
    // keep getting a random food thats available
    // return this.getRandomFood();

    let food = this.getRandomFood();
    let foodAvailable = food.available;
    let ignoreFood = food.ignore;
    let poundsPer1000Calorie = food.poundsPer1000Calories;
    let rank = food.rankWeighting*1;
    // if (isNaN(rank)) {
    //   rank = 0;
    // }

    // get another food if food not available, or ignoring food, or costs too much
    // ~ 1400 calories a day ~ 10000 calories every 7 days. £70 per 10000 calories
    let limit = 0;
    while ((!foodAvailable || ignoreFood || poundsPer1000Calorie > 6.3 || rank == -1 || rank == 1) && limit < 20000) {
      food = this.getRandomFood();
      foodAvailable = food.available;
      ignoreFood = food.ignore;
      poundsPer1000Calorie = food.poundsPer1000Calories;
      rank = food.rankWeighting*1;
      limit += 1;
      // if (isNaN(rank)) {
      //   rank = 0;
      // }
    }

    // console.log('food name: ', food[0], " rank: ", rank, "food[19]*1: ", food[19]*1);
    // console.log('food[21]: ', food[21]);
    // console.log('poundsPer1000Calorie: ', poundsPer1000Calorie);

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
      // use proteinPer100Calories
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
      // console.log('protein: ', protein);
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
      // console.log('protein: ', protein);
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
      // console.log('protein: ', protein);
      if (!isNaN(price)) {
        totalPrice += price;
      }
    }

    return totalPrice;
  }

  public fixFoods() {
    const selectedNodes = this.agGridPickedFoods.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => {
      return node.data;
    });

    this.agGridFixedFoods.api.setRowData(selectedData);
    // this.agGridPickedFoods.api
  }

  // public fixFood(index: number) {
  //   this.fixedFoods.push(this.pickedFoods[index]);
  //   console.log(this.pickedFoods[index]);
  //   this.pickedFoods.splice(index, 1);
  // }

  public replaceFixedFood(index: number) {
    // Remove the fixed food
    this.fixedFoods.splice(index, 1);

    // Add another random food to picked foods
    this.pickedFoods.push(this.getRandomValidFood());

    this.recalculateNumbers();
    this.recalculateFoods();
  }

  public replaceFood(index: number) {
    // Remove the food from the list
    this.pickedFoods.splice(index, 1);

    // Add another random food
    this.pickedFoods.push(this.getRandomValidFood());

    this.recalculateNumbers();
    this.recalculateFoods();
  }

  public removeFood(index: number) {
    // Remove the food from the list
    this.pickedFoods.splice(index, 1);

    this.recalculateNumbers();
    this.recalculateFoods();
  }

  public onClickPickedFood(index: number) {
    const url = this.pickedFoods[index].url;
    window.open(url, '_blank');
  }

  public onClickFixedFood(index: number) {
    const url = this.fixedFoods[index].url;
    window.open(url, '_blank');
  }

  public notAvailable() {
    // Set the food availability to false and remove the food from the list
    const selectedNodes = this.agGridPickedFoods.api.getSelectedNodes()
    selectedNodes.forEach(node => {
      const data: Food = node.data;
      const index = this.pickedFoods.findIndex((f) => f.id === data.id)
      if (index) {
        this.pickedFoods[index].available = false;
        this.pickedFoods.splice(index, 1);
      }

      const index2 = this.fixedFoods.findIndex((f) => f.id === data.id)
      if (index2) {
        this.fixedFoods[index2].available = false;
        this.fixedFoods.splice(index2, 1);
      }

      const index3 = this.matchingFoods.findIndex((f) => f.id === data.id)
      if (index3) {
        this.matchingFoods[index3].available = false;
        this.matchingFoods.splice(index3, 1);
      }
    });
    



    // const food = this.pickedFoods[index];
    // food.totalCalories
    // const foodsIndex = this.foods.findIndex((element) => element.id == food.id);
    // this.foods[foodsIndex].available = false;

    // Remove the food from the picked foods list
    // this.pickedFoods.splice(index, 1);

    // Replace with a random food
    this.pickedFoods.push(this.getRandomValidFood());

    this.recalculateNumbers();
    this.recalculateFoods();
  }

  public searchFood(name: string) {
    console.log('search: ', name);
    this.matchingFoods = this.foods.filter((element) => element[0].includes(name));
  }

  public onClickMatchingFood(index: number) {
    const url = this.matchingFoods[index].url;
    window.open(url, '_blank');
  }

  public addMatchingFood(index: number) {
    let food = this.matchingFoods[index];
    console.log('matchingFood: ', food);
    this.fixedFoods.push(food);

    this.recalculateNumbers();
    this.recalculateFoods();
  }

  //////////////////////////////////////

  rowData: Observable<any[]>;
  @ViewChild('agGridMatchingFoods') agGridMatchingFoods!: AgGridAngular;
  @ViewChild('agGridFixedFoods') agGridFixedFoods!: AgGridAngular;
  @ViewChild('agGridPickedFoods') agGridPickedFoods!: AgGridAngular;

  defaultColDef: ColDef = {
    flex: 1,
    sortable: true,
    filter: true,
  };

  columnDefs: ColDef[] = [
    { field: 'name', minWidth: 300, checkboxSelection: true },
    { field: 'proteinPer100Calorie'},
    { field: 'totalCalories'},
    { field: 'totalProtein'},
    { field: 'poundsPer1000Calories'},
    { field: 'rankWeighting'},
    // { field: 'make', rowGroup: true },
    { field: 'price' }
  ];

  gridOptions: GridOptions = {
    rowClassRules: {
      'rated-before': params => params.api.getValue('rankWeighting', params.node) != 0,
    }
  }



  // autoGroupColumnDef: ColDef = {
  //     headerName: 'Model',
  //     field: 'model',
  //     cellRenderer: 'agGroupCellRenderer',
  //     cellRendererParams: {
  //         checkbox: true
  //     }
  // };

  getSelectedRows(): void {
        const selectedNodes = this.agGridPickedFoods.api.getSelectedNodes();
        const selectedData = selectedNodes.map(node => {
          if (node.groupData) {
            return { make: node.key, model: 'Group' };
          }
          return node.data;
        });
        const selectedDataStringPresentation = selectedData.map(node => `${node.make} ${node.model}`).join(', ');

        alert(`Selected nodes: ${selectedDataStringPresentation}`);
  }








}

// TODO
// search and add foods