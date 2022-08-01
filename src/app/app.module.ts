import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { LoginComponent } from './pages/login/login.component';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { InterceptorService } from './auth/interceptor.service';
import { FoodDiaryComponent } from './pages/food-diary/food-diary.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FoodEffects } from './store/effects/food.effects';
import { EatenFoodEffects } from './store/effects/eatenFood.effects';
import { ChosenFoodEffects } from './store/effects/chosenFood.effects';
import { appReducer } from './store/reducer/app.reducer';

@NgModule({
  declarations: [
    AppComponent,
    NameRendererComponent,
    RankingRendererComponent,
    HeaderComponent,
    FoodListComponent,
    AddFoodComponent,
    ToastComponent,
    LoginComponent,
    LoadingSpinnerComponent,
    FoodDiaryComponent,
    LineChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    AgGridModule.withComponents([NameRendererComponent, RankingRendererComponent, { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }]),
    StoreModule.forRoot(appReducer, {}),
    EffectsModule.forRoot([FoodEffects, EatenFoodEffects, ChosenFoodEffects]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
