import { Component, OnInit } from '@angular/core';
import { HelperService } from '../../core/services/helper.service';
import * as Feather from "feather-icons";
import { SecurityHelper } from '../../core/helpers/security-helper';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../users/models/entitys/user';

type UserSession = {
  token:string,
  email:string,
  name:string,
  userID:number,
  changePassword:boolean
  }; 

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private helperService : HelperService,
    private router: Router,
    private _route: ActivatedRoute,
  ) { }
  user:User;
  userToken:UserSession;

  ngOnInit(): void {

    this.helperService.loadScript(
      '../../../../assets/js/scripts.js'
    ).subscribe(response=>{
      Feather.replace();
    });
    this.user = new User();
    this.userToken = JSON.parse(localStorage.getItem('token')) as UserSession;
    this.user.userID=this.userToken.userID;
    this.user.firstName=this.userToken.name;
    this.user.email=this.userToken.email;
  }

  logout()
  {
    SecurityHelper.deleteToken();
    this.user=undefined;
    this.router.navigate(['/account/login']);
  }

}
