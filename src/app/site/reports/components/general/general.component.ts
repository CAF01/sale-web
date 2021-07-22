import { Component, OnInit } from '@angular/core';
import { saveAs } from "file-saver";
import * as Feather from 'feather-icons';
import { ReportService } from '../../services/report.service';
import { StatusRequest } from '../../models/request/statusrequest';
import { ChartService } from 'src/app/site/core/services/chart.service';
import { RangeDate } from 'src/app/site/core/helpers/rangeDate';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {

  earnMonth:string='0';
  earnYear:string='0';
  users:number=0;
  pendingPayments:number=0;
  request: StatusRequest;
  dateRange: RangeDate;
  
  constructor(private reportService:ReportService,
    private chartService:ChartService) { }

  ngOnInit(): void {
    Feather.replace();
    this.getValuesForReport();
  }

  onSelectDate(event: RangeDate) {
    this.dateRange = event;
    // this.request.startdate = event.startDateApi();
    // this.request.endingdate = event.endDateApi();
    console.log(this.dateRange);
  }

  getValuesForReport()
  {
    this.chartService.getReports().subscribe(request=>
      {
        this.earnMonth=this.formatToCurrency(request.earnMonth);
        this.earnYear=this.formatToCurrency(request.earnYear);
        this.users=request.users;
        this.pendingPayments=request.pendingPayments;
      })
  }
  formatToCurrency = amount => {
    return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  };

  generatereportSale()
  {
    let request = new StatusRequest();
    this.reportService.downloadReportSale(request).subscribe((file) => {
      if (file) {
        saveAs(file, "Ventas");
      }
    });
  }
  generatereportSaleMonth()
  {
    let request = new StatusRequest();
    request.startdate=new Date();
    console.log(request);
    this.reportService.downloadReportSaleMonth(request).subscribe((file) => {
      if (file) {
        saveAs(file, "Ventas_Mensual");
      }
    });
  }
  generatereportSaleYear()
  {
    let request = new StatusRequest();
    request.startdate=new Date();
    this.reportService.downloadReportSaleYear(request).subscribe((file) => {
      if (file) {
        saveAs(file, "Ventas_anual");
      }
    });
  }
  
  generateReportProductivity()
  {
    let request = new StatusRequest();
    this.reportService.downloadReportProductivity(request).subscribe((file) => {
      if (file) {
        saveAs(file, "Productividad");
      }
    });
  }
  generateReportPendings()
  {
    let request = new StatusRequest();
    this.reportService.downloadReportPendings(request).subscribe((file) => {
      if (file) {
        saveAs(file, "Pagos_pendientes");
      }
    });
  }
}
