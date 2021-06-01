import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientComponentsRoutingModule } from './client-components-routing.module';
import { ClientsComponent } from './clients/clients.component';




@NgModule({
  declarations: [
    ClientsComponent
  ],
  imports: [
    CommonModule,
    ClientComponentsRoutingModule
  ]
})
export class ClientComponentsModule { }
