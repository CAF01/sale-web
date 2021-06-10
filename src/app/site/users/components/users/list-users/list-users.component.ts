import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/site/services/helper.service';
import * as Feather from 'feather-icons';
import { UserService } from '../../../services/user.service';
import { PaginationListResponse } from 'src/app/site/models/pagination-list-response';
import { User } from '../../../models/entitys/user';
import * as moment from 'moment';




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

    Feather.replace();

    this.getUsers();

    moment().locale('es');
  }

   getUsers() {
    this.usersService.getUsers().subscribe(response=>{
      this.users=response;
    },error=>{
 
    });

  }
  getAddresbyIDuser(id:number)
  {
    this.usersService.getAddressbyID(id).subscribe(response=>
      {
        if (response) {
          console.log(response);
        }
      },error=>
      {

      }); 
  }

  

  formatDate(date:Date){
    
    return new Date(date);
  }
}
