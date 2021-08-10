import { Component, OnInit } from '@angular/core';
import { HelperService } from '../../core/services/helper.service';
import * as Feather from 'feather-icons';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label, ThemeService } from 'ng2-charts';
import { ChartSale } from '../../core/models/chart-sale';
import { ChartService } from '../../core/services/chart.service';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { SalesInfo } from '../../sales/models/entitys/salesinfo';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SetPasswordModalComponent } from '../../users/components/users/set-password-modal/set-password-modal.component';

type UserSession = {
  token:string,
  email:string,
  name:string,
  userID:number,
  changePassword:boolean
  }; 


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  userInfo: UserSession;
  Earns:number[]=[0,0,0];
  barStructure:ChartSale[]=[];
  chartStructure: ChartSale[] = [];

  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: ChartOptions = {
    responsive: true,
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'rgb(75, 192, 192)',
      pointBorderColor: 'yellow',
      pointBackgroundColor:'blue',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];



  public lineChartDataProd: ChartDataSets[] = [];
  public lineChartLabelsProd: Label[] = [];
  public lineChartOptionsProd: ChartOptions = {
    responsive: true,
    legend:{position:'top'},
    title:{display:true,text:'Productos mas vendidos'},
  };
  public lineChartColorsProd: Color[] = [
    {
      borderColor: 'rgb(75, 192, 192)',
      pointBorderColor: 'yellow',
      pointBackgroundColor:'blue',
      backgroundColor:['#D93425','#05AFF2','#F29F05','#5DA684','#595959']
    },
  ];
  public lineChartLegendProd = true;
  public lineChartTypeProd = 'bar';
  public lineChartPluginsProd = [];

  
  constructor(
    private helperService: HelperService,
    private chartService: ChartService,
    private router : Router,
    private modalService : NgbModal
  ) {}

  ngOnInit(): void {
    this.helperService
      .loadScript('../../../../assets/js/scripts.js')
      .subscribe((response) => {
        Feather.replace();
      });
    this.userInfo = JSON.parse(localStorage.getItem('token')) as UserSession;
    if(this.userInfo.changePassword)
    {
      this.openModal();
    }
    this.getChartWeek();
    this.initSiganR();
    // this.GetDailyReport();
  }

  async getChartWeek() {
    this.chartStructure = await this.chartService.getChart(1).toPromise();
    this.lineChartData = [
      { data: this.chartStructure.map((data) => Number(data.y)),label:'Ventas: ',fill:false },
    ];
    this.lineChartLabels = this.chartStructure.map((label) => label.x);

    var response = await this.chartService.getDailyReport(4).toPromise();
    if(response)
    {
      
      response.earnDay > 0 ? this.Earns[0]=response.earnDay : this.Earns[0]=0.00;
      response.avgSale > 0 ? this.Earns[1]=response.avgSale : this.Earns[1]=0.00;
      response.earnYear > 0 ? this.Earns[2]=response.earnYear : this.Earns[2]=0.00;
    }

    this.barStructure= await this.chartService.getChart(5).toPromise();
    this.lineChartDataProd=[
      {data:this.barStructure.map((data)=>Number(data.y)),fill:false,label:'Consumo'}
    ];
    this.lineChartLabelsProd=this.barStructure.map((label)=>label.x);
  }

   initSiganR() {
    let connection = new HubConnectionBuilder()
      .withUrl(`${environment.url_base}Sales`)
      .build();
    connection.on('SaleInsert', (data) => {
      let Sale = data as SalesInfo;
      this.Earns[0]+=Sale.payed;
      this.Earns[2]+=parseInt((Sale.payed).toFixed(0));

    });

    connection.start().then();
  }

  openGeneralReports()
  {
    this.router.navigate(['home/reports']);
  }

  openModal()
  {
    let modal = this.modalService.open(SetPasswordModalComponent, {
      centered: true,
      backdrop:'static',
      keyboard:false
    });

    modal.componentInstance.userID=this.userInfo.userID;
    
    modal.result
      .then((result) => {
        if (result) 
        {}
      })
      .catch((err) => {});
  }

  // async GetDailyReport()
  // {
  //   var response = await this.chartService.getDailyReport(4).toPromise();
  //   this.Earns[0]=response.earnDay;
  //   this.Earns[1]=response.avgSale;
  //   this.Earns[2]=response.earnYear;
  //   console.log(response);
  // }

}
