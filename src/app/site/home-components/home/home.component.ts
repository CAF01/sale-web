import { Component, OnInit } from '@angular/core';
import { HelperService } from '../../services/helper.service';
import * as Feather from "feather-icons";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

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
