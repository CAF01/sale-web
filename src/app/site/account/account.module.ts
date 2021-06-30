import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { LoginComponent } from './components/login/login.component';
import { SharedComponentsModule } from '../shared-components/shared-components.module';


@NgModule({
  declarations: [
  
    LoginComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    SharedComponentsModule,
  ]
})
export class AccountModule { }
