import { Component, OnInit } from '@angular/core';
import { saveAs } from "file-saver";
import * as Feather from 'feather-icons';
import { ReportService } from '../../services/report.service';
import { StatusRequest } from '../../models/request/statusrequest';
import { ChartService } from 'src/app/site/core/services/chart.service';
import { RangeDate } from 'src/app/site/core/helpers/rangeDate';
import { ToastrService } from 'ngx-toastr';

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
    private chartService:ChartService,
    private toastr:ToastrService) { }

  ngOnInit(): void {
    Feather.replace();
    this.getValuesForReport();
  }

  onSelectDate(event: RangeDate) {
    this.dateRange = event;
    this.request=new StatusRequest();
    this.request.startdate = new Date(event.startDateApi());
    this.request.endingdate = new Date(event.endDateApi());
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
    this.reportService.downloadReportSale(this.request).subscribe((file) => {
      if (file) {
        saveAs(file, "Ventas");
      }
    },error=>
    {
      if(error.status==404)
      {
        this.toastr.error('No hay datos en la fecha seleccionada','Error');
      }
    });
  }

  generatereportProductivityDate()
  {
    this.reportService.downloadReportProductivity(this.request).subscribe((file) => {
      if (file) {
        saveAs(file, "Productividad_usuarios");
      }
    },error=>
    {
      if(error.status==404)
      {
        this.toastr.error('No hay datos en la fecha seleccionada','Error');
      }
    });
  }
  generatereportHistorialPayDate()
  {
    this.reportService.downloadReportHistorial(this.request).subscribe((file) => {
      if (file) {
        saveAs(file, "Pagos_de_clientes");
      }
    },error=>
    {
      if(error.status==404)
      {
        this.toastr.error('No hay datos en la fecha seleccionada','Error');
      }
    });
  }

  generatereportSaleMonth()
  {
    let request = new StatusRequest();
    request.startdate=new Date();
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
      if (file) 
      {
        saveAs(file, "Ventas_anual");
      }
    },error=>
    {
      if (error.status==404)
      {
        this.toastr.error('No hay información disponible');
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
    },error=>
    {
      if (error.status==404)
      {
        this.toastr.error('No hay información disponible');
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
    },error=>
    {
      if (error.status==404)
      {
        this.toastr.error('No hay información disponible');
      }
    });
  }
}
