import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { NewUserComponent } from './components/users/new-user/new-user.component';
import { UpdateUserComponent } from './components/users/update-user/update-user.component';
import { ListUsersComponent } from './components/users/list-users/list-users.component';
import { NewAddressComponent } from './components/address/new-address/new-address.component';
import { UpdateAddressComponent } from './components/address/update-address/update-address.component';
import { MomentModule } from 'ngx-moment';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { SetPasswordModalComponent } from './components/users/set-password-modal/set-password-modal.component';




@NgModule({
  declarations: [
    NewUserComponent,
    UpdateUserComponent,
    ListUsersComponent,
    NewAddressComponent,
    UpdateAddressComponent,
    SetPasswordModalComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MomentModule,
    SharedComponentsModule
  

  ],schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class UsersModule {
 }
