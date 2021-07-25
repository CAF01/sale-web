import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GetBrandsComponent } from './components/brands/get-brands/get-brands.component';
import { GetCategoriesComponent } from './components/categories/get-categories/get-categories.component';
import { GetPaymentmethodComponent } from './components/paymentmethods/get-paymentmethod/get-paymentmethod.component';
import { GetReasonreturnclientComponent } from './components/reasonreturnclients/get-reasonreturnclient/get-reasonreturnclient.component';
import { GetReasonreturnproviderComponent } from './components/reasonreturnproviders/get-reasonreturnprovider/get-reasonreturnprovider.component';
// import { CatalogsComponent } from './catalogs.component';

const routes: Routes = [
  {
    path: 'brands',
    component: GetBrandsComponent /* component: CatalogsComponent */,
  },
  {
    path:'categories',
    component:GetCategoriesComponent
  },
  {
    path:'paymentmethods',
    component:GetPaymentmethodComponent
  },
  {
    path:'reason',
    component:GetReasonreturnclientComponent
  },
  {
    path:'reason-provider',
    component:GetReasonreturnproviderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogsRoutingModule {}
