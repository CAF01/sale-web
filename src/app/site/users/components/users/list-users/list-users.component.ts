import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/site/services/helper.service';
import * as Feather from 'feather-icons';
import { UserService } from '../../../services/user.service';
import { PaginationListResponse } from 'src/app/site/models/pagination-list-response';
import { user } from 'src/app/site/user-components/models/entitys/user';
import { User } from '../../../models/entitys/user';



@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss'],
})
export class ListUsersComponent implements OnInit {

  users:PaginationListResponse<User> | undefined;

  constructor(
    private helperService: HelperService,
    private usersService: UserService
  ) {

  }

  ngOnInit(): void {
    this.loadJs();

    this.getUsers();
  }

   getUsers() {
    this.usersService.getUsers().subscribe(response=>{
      this.users=response;
      console.log(this.users.data[0])
    },error=>{
 
    });

  

  }

  loadJs(): void {
    this.helperService
      .loadScript('../../../../assets/js/scripts.js')
      .subscribe((response) => {
        Feather.replace();
      });
  }
}
