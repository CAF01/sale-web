import { Component, OnInit } from '@angular/core';
import { HelperService } from '../../core/services/helper.service';
import * as Feather from "feather-icons";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private helperService : HelperService 
  ) { }

  ngOnInit(): void {
    
    this.helperService.loadScript(
      '../../../../assets/js/scripts.js'
    ).subscribe(response=>{
      Feather.replace();
    });
    
  }

}
