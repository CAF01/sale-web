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
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { MomentModule } from 'ngx-moment';
import { GetPendingPaymentsComponent } from './components/pending-payment/get-pending-payments/get-pending-payments.component';
import { NgxCurrencyModule } from 'ngx-currency';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    // SalesComponent,
    // InsertSaleComponent,
    UpdateSaleComponent,
    NewSaleComponent,
    GetSaleComponent,
    GetContentSaleComponent,
    NewPaymentHistorialComponent,
    GetPaymentHistorialComponent,
    GetPendingPaymentsComponent
  ],
  imports: [
    CommonModule,
    SalesRoutingModule,
    SharedComponentsModule,
    MomentModule,
    NgxCurrencyModule,
    
  ]
})
export class SalesModule { }
