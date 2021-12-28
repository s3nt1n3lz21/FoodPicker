import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';
import 'ag-grid-enterprise';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NameRendererComponent } from './ag-grid/renderers/name-renderer/name-renderer.component';
import { RankingRendererComponent } from './ag-grid/renderers/ranking-renderer/ranking-renderer.component';
import { HeaderComponent } from './pages/header/header.component';
import { FoodListComponent } from './pages/food-list/food-list.component';
import { AddFoodComponent } from './pages/add-food/add-food.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastComponent } from './toast/toast/toast.component';

@NgModule({
  declarations: [
    AppComponent,
    NameRendererComponent,
    RankingRendererComponent,
    HeaderComponent,
    FoodListComponent,
    AddFoodComponent,
    ToastComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    AgGridModule.withComponents([NameRendererComponent, RankingRendererComponent]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
