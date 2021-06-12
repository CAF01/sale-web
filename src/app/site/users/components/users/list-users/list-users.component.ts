import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/site/services/helper.service';
import * as Feather from 'feather-icons';
import { UserService } from '../../../services/user.service';
import { PaginationListResponse } from 'src/app/site/models/pagination-list-response';
import { User } from '../../../models/entitys/user';
import * as moment from 'moment';
import { UsersModule } from '../../../users.module';
import { userInfo } from '../../../models/entitys/userInfo';
import { Router, RouterLink } from '@angular/router';
import { stringify } from '@angular/compiler/src/util';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss'],
})
export class ListUsersComponent implements OnInit {
  users: PaginationListResponse<User> | undefined;

  constructor(
    private helperService: HelperService,
    private usersService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUsers();

    moment().locale('es');
  }

  getUsers() {
    this.usersService.getUsers().subscribe(
      (response) => {
        this.users = response;
      },
      (error) => {}
    );
  }
  getAddres(user: User) {}

  edit(user: userInfo) {
    this.router.navigate(['home/users/update-user'], {
      queryParams: { user: JSON.stringify(user) },skipLocationChange:true//skip location para ocultar el json de la URL
    });
  }

  formatDate(date: Date) {
    return new Date(date);
  }
}
