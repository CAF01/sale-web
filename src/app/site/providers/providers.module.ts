import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProvidersRoutingModule } from './providers-routing.module';
import { InsertProviderComponent } from './components/providers/insert-provider/insert-provider.component';
import { UpdateProviderComponent } from './components/providers/update-provider/update-provider.component';
import { SetStatusProviderComponent } from './components/providers/set-status-provider/set-status-provider.component';
import { GetProvidersComponent } from './components/providers/get-providers/get-providers.component';
import { InsertReturnproviderComponent } from './components/return-provider/insert-returnprovider/insert-returnprovider.component';
import { GetReturnproviderComponent } from './components/return-provider/get-returnprovider/get-returnprovider.component';
import { InsertInvoiceComponent } from './components/invoice/insert-invoice/insert-invoice.component';
import { GetContentInvoiceComponent } from './components/invoice/get-content-invoice/get-content-invoice.component';
import { GetInvoiceComponent } from './components/invoice/get-invoice/get-invoice.component';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { MomentModule } from 'ngx-moment';


@NgModule({
  declarations: [
    // ProvidersComponent
    InsertProviderComponent,
    UpdateProviderComponent,
    SetStatusProviderComponent,
    GetProvidersComponent,
    InsertReturnproviderComponent,
    GetReturnproviderComponent,
    InsertInvoiceComponent,
    GetContentInvoiceComponent,
    GetInvoiceComponent
  ],
  imports: [
    CommonModule,
    ProvidersRoutingModule,
    SharedComponentsModule,
    MomentModule,
  ]
})
export class ProvidersModule { }
