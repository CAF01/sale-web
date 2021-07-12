import { Component, OnInit } from '@angular/core';
import { HelperService } from '../../core/services/helper.service';
import * as Feather from "feather-icons";
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { ChartSale } from '../../core/models/chart-sale';
import { ChartService } from '../../core/services/chart.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  chartStructure : ChartSale[]=[];

  public lineChartData: ChartDataSets[] = [
    { data: [],label:''},
  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: ChartOptions = {
    responsive: true,
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];


  constructor(
    private helperService : HelperService,
    private chartService:ChartService 
  ) { }

  ngOnInit(): void {
    
    this.helperService.loadScript(
      '../../../../assets/js/scripts.js'
    ).subscribe(response=>{
      Feather.replace();
    });
    this.getChartWeek();
  }

  async getChartWeek()
  {
    this.chartStructure = await this.chartService.getChart(1).toPromise();
    this.lineChartData = [{data: this.chartStructure.map(data=>Number(data.y)) }];
    this.lineChartLabels = this.chartStructure.map(label=>label.x);
  }

}
