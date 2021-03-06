import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListUsersComponent } from './components/users/list-users/list-users.component';
import { NewUserComponent } from './components/users/new-user/new-user.component';
import { MomentModule } from 'ngx-moment';
import { UpdateUserComponent } from './components/users/update-user/update-user.component';

const routes: Routes = [
  {
    path: 'new-user',
    component: NewUserComponent /*, component: UsersComponent*/,
  },
  { path: 'list', component: ListUsersComponent },
  {path:'update-user',component:UpdateUserComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes), MomentModule],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
