import { Component, OnInit } from '@angular/core';
import { HelperService } from '../../core/services/helper.service';
import * as Feather from "feather-icons";
import { SecurityHelper } from '../../core/helpers/security-helper';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../users/models/entitys/user';

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

  ngOnInit(): void {

    this.helperService.loadScript(
      '../../../../assets/js/scripts.js'
    ).subscribe(response=>{
      Feather.replace();
    });
    this._route.queryParams.subscribe((params) => {
      if (params.user) {
        this.user = JSON.parse(params.user) as User;
      }
    });
  }

  logout()
  {
    SecurityHelper.deleteToken();
    this.user=undefined;
    this.router.navigate(['/account/login']);
  }

}
