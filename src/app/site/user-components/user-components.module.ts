import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserComponentsRoutingModule } from './user-components-routing.module';
import { AddressComponent } from './address/address.component';
import { UsersComponent } from './users/users.component';
// import { UserComponentsComponent } from './user-components.component';
// import { UsersComponent } from './users/users.component';


@NgModule({
  declarations: [
    // UserComponentsComponent,
    // UsersComponent
  
    AddressComponent,
    UsersComponent
  ],
  imports: [
    CommonModule,
    UserComponentsRoutingModule
  ]
})
export class UserComponentsModule { }
