import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddFoodComponent } from './pages/add-food/add-food.component';
import { FoodListComponent } from './pages/food-list/food-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'food-list', pathMatch: 'full' },

  {
    path: 'food-list',
    component: FoodListComponent,
  },

  {
    path: 'add-food',
    component: AddFoodComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
