import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponentsRoutingModule } from './home-components-routing.module';


@NgModule({
  declarations: [
    // HomeComponentsComponent,
    // HomeComponent
  ],
  imports: [
    CommonModule,
    HomeComponentsRoutingModule
  ]
})

export class HomeComponentsModule { }