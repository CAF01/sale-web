import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponentsRoutingModule } from './home-components-routing.module';
import { HomeComponent } from './home/home.component';



@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeComponentsRoutingModule
  ]
})
export class HomeComponentsModule { }
