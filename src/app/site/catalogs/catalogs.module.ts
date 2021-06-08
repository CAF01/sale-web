import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogsRoutingModule } from './catalogs-routing.module';
import { SetStatusBrandComponent } from './components/brands/set-status-brand/set-status-brand.component';
import { GetBrandsComponent } from './components/brands/get-brands/get-brands.component';
import { InsertCategoryComponent } from './components/categories/insert-category/insert-category.component';
import { UpdateCategoryComponent } from './components/categories/update-category/update-category.component';
import { SetStatusCategoryComponent } from './components/categories/set-status-category/set-status-category.component';
import { GetCategoriesComponent } from './components/categories/get-categories/get-categories.component';
import { InsertPaymentmethodComponent } from './components/paymentmethods/insert-paymentmethod/insert-paymentmethod.component';
import { UpdatePaymentmethodComponent } from './components/paymentmethods/update-paymentmethod/update-paymentmethod.component';
import { SetStatusPaymentmethodComponent } from './components/paymentmethods/set-status-paymentmethod/set-status-paymentmethod.component';
import { GetPaymentmethodComponent } from './components/paymentmethods/get-paymentmethod/get-paymentmethod.component';
import { InsertReasonreturnclientComponent } from './components/reasonreturnclients/insert-reasonreturnclient/insert-reasonreturnclient.component';
import { UpdateReasonreturnclientComponent } from './components/reasonreturnclients/update-reasonreturnclient/update-reasonreturnclient.component';
import { GetReasonreturnclientComponent } from './components/reasonreturnclients/get-reasonreturnclient/get-reasonreturnclient.component';
import { InsertReasonreturnproviderComponent } from './components/reasonreturnproviders/insert-reasonreturnprovider/insert-reasonreturnprovider.component';
import { UpdateReasonreturnproviderComponent } from './components/reasonreturnproviders/update-reasonreturnprovider/update-reasonreturnprovider.component';
import { GetReasonreturnproviderComponent } from './components/reasonreturnproviders/get-reasonreturnprovider/get-reasonreturnprovider.component';
// import { UpdateBrandComponent } from './components/brands/update-brand/update-brand.component';
// import { CatalogsComponent } from './catalogs.component';


@NgModule({
  declarations: [
    // CatalogsComponent
  
    // InsertBrandComponent,
    // UpdateBrandComponent
  
    SetStatusBrandComponent,
    GetBrandsComponent,
    InsertCategoryComponent,
    UpdateCategoryComponent,
    SetStatusCategoryComponent,
    GetCategoriesComponent,
    InsertPaymentmethodComponent,
    UpdatePaymentmethodComponent,
    SetStatusPaymentmethodComponent,
    GetPaymentmethodComponent,
    InsertReasonreturnclientComponent,
    UpdateReasonreturnclientComponent,
    GetReasonreturnclientComponent,
    InsertReasonreturnproviderComponent,
    UpdateReasonreturnproviderComponent,
    GetReasonreturnproviderComponent
  ],
  imports: [
    CommonModule,
    CatalogsRoutingModule
  ]
})
export class CatalogsModule { }
