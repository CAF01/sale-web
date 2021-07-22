import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { GeneralComponent } from './components/general/general.component';
import { SharedComponentsModule } from '../shared-components/shared-components.module';


@NgModule({
  declarations: [
    GeneralComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedComponentsModule
  ]
})
export class ReportsModule { }
