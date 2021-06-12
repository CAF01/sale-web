import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
// import { UsersComponent } from './users.component';
import { NewUserComponent } from './components/users/new-user/new-user.component';
import { UpdateUserComponent } from './components/users/update-user/update-user.component';
import { ListUsersComponent } from './components/users/list-users/list-users.component';
import { NewAddressComponent } from './components/address/new-address/new-address.component';
import { UpdateAddressComponent } from './components/address/update-address/update-address.component';
import { MomentModule } from 'ngx-moment';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import {LottieModule} from 'ngx-lottie';
import player from 'lottie-web';

export function playerFactory()
{
  return player;
}

@NgModule({
  declarations: [
    // UsersComponent,
    NewUserComponent,
    UpdateUserComponent,
    ListUsersComponent,
    NewAddressComponent,
    UpdateAddressComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MomentModule,
    SharedComponentsModule,
    LottieModule.forRoot({player:playerFactory})
  ]
})
export class UsersModule {
 }
