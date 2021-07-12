import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GetContentSaleComponent } from './components/content-sales/get-content-sale/get-content-sale.component';
import { GetPendingPaymentsComponent } from './components/pending-payment/get-pending-payments/get-pending-payments.component';
import { GetSaleComponent } from './components/sales/get-sale/get-sale.component';
import { NewSaleComponent } from './components/sales/new-sale/new-sale.component';
import { UpdateSaleComponent } from './components/sales/update-sale/update-sale.component';

const routes: Routes = [
  { 
    path: 'new-sale', 
    component: UpdateSaleComponent 
  },
  {
    path: 'list',
    component: GetSaleComponent
  },
  {
    path:'sale',
    component:GetContentSaleComponent
  },
  {
    path:'pending-payments',
    component:GetPendingPaymentsComponent
  },
  // {
  //   path:'new-sale-beta',
  //   component:NewSaleComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesRoutingModule {}
