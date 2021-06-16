import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
// import { SalesComponent } from './sales.component';
// import { InsertSaleComponent } from './components/sales/insert-sale/insert-sale.component';
import { UpdateSaleComponent } from './components/sales/update-sale/update-sale.component';
import { NewSaleComponent } from './components/sales/new-sale/new-sale.component';
import { GetSaleComponent } from './components/sales/get-sale/get-sale.component';
import { GetContentSaleComponent } from './components/content-sales/get-content-sale/get-content-sale.component';
import { NewPaymentHistorialComponent } from './components/payment-historial/new-payment-historial/new-payment-historial.component';
import { GetPaymentHistorialComponent } from './components/payment-historial/get-payment-historial/get-payment-historial.component';


@NgModule({
  declarations: [
    // SalesComponent,
    // InsertSaleComponent,
    UpdateSaleComponent,
    NewSaleComponent,
    GetSaleComponent,
    GetContentSaleComponent,
    NewPaymentHistorialComponent,
    GetPaymentHistorialComponent
  ],
  imports: [
    CommonModule,
    SalesRoutingModule
  ]
})
export class SalesModule { }
