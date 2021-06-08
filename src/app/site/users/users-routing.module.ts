import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListUsersComponent } from './components/users/list-users/list-users.component';
import { NewUserComponent } from './components/users/new-user/new-user.component';
import { MomentModule } from 'ngx-moment';
const routes: Routes = [{ path: 'new-user',component: NewUserComponent/*, component: UsersComponent*/ },
{path:'', component:ListUsersComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes),MomentModule],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
