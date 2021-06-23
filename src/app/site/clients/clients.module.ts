import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsRoutingModule } from './clients-routing.module';
import { InsertClientComponent } from './components/clients/insert-client/insert-client.component';
import { UpdateClientComponent } from './components/clients/update-client/update-client.component';
import { SetStatusClientComponent } from './components/clients/set-status-client/set-status-client.component';
import { GetClientsComponent } from './components/clients/get-clients/get-clients.component';
import { InsertAddressComponent } from './components/address/insert-address/insert-address.component';
import { UpdateAddressComponent } from './components/address/update-address/update-address.component';
import { GetAddressComponent } from './components/address/get-address/get-address.component';
import { InsertReturnComponent } from './components/returnclients/insert-return/insert-return.component';
import { GetReturnsComponent } from './components/returnclients/get-returns/get-returns.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { MomentModule } from 'ngx-moment';
import { SharedComponentsModule } from '../shared-components/shared-components.module';


@NgModule({
  declarations: [
  
    InsertClientComponent,
       UpdateClientComponent,
       SetStatusClientComponent,
       GetClientsComponent,
       InsertAddressComponent,
       UpdateAddressComponent,
       GetAddressComponent,
       InsertReturnComponent,
       GetReturnsComponent
  ],
  imports: [
    CommonModule,
    ClientsRoutingModule,
    MomentModule,
    SharedComponentsModule,
    NgbPaginationModule
  ]
})
export class ClientsModule { }
