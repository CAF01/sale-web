import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponentsRoutingModule } from './home-components-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
// import { HomeComponentsComponent } from './home-components.component';
// import { HomeComponent } from './home/home.component';


@NgModule({
  declarations: [
    // HomeComponentsComponent,
    // HomeComponent
  
    DashboardComponent
  ],
  imports: [
    CommonModule,
    HomeComponentsRoutingModule
  ]
})
export class HomeComponentsModule { }
