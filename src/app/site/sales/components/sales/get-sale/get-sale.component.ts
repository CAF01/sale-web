import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HubConnectionBuilder } from '@microsoft/signalr';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ValidateForm } from 'src/app/site/core/helpers/validate-formfields-helper';
import { PaginationListResponse } from 'src/app/site/core/models/pagination-list-response';
import { environment } from 'src/environments/environment';
import { SalesInfo } from '../../../models/entitys/salesinfo';
import { SalesService } from '../../../services/sales.service';

@Component({
  selector: 'app-get-sale',
  templateUrl: './get-sale.component.html',
  styleUrls: ['./get-sale.component.scss']
})
export class GetSaleComponent implements OnInit {

  validateForm = ValidateForm;
  
  searchForm:FormGroup;

  page: number = 1;

  Sales : PaginationListResponse<SalesInfo> | undefined;

  constructor(
    private router: Router,
    private toastr : ToastrService,
    private _formBuilder: FormBuilder,
    private saleService:SalesService) { }

  ngOnInit(): void {
    this.getSales();
    moment().locale('es');
    // this.initSiganR();
    this.SetSearchForm();
  }

  getSales()
  {
    this.saleService.GetSales().subscribe(request=>
      {
        this.Sales=request;
      },error=>
      {
        console.log(error);
      });
  }

  formatDate(date: Date) {
    return new Date(date);
  }

  openSale(sale:SalesInfo)
  {
    this.router.navigate(['home/sales/sale'], {
      queryParams: { sale: JSON.stringify(sale) },
      skipLocationChange: true, //skip location para ocultar el json de la URL
    });
  }

  onEnter(event: KeyboardEvent) {
    this.onSearch();
  }
  
  onSearch()
  {
    if(this.searchForm.valid)
    {
      this.saleService.getSaleByID(this.searchForm.get('saleID').value).subscribe(request=>
        {
          this.openSale(request);
        },error=>
        {
          this.toastr.error('El número de referencia no existe','Error');
        });
    }
    else
    {
      this.validateForm.validateAllFormFields(this.searchForm);
    }
  }


  SetSearchForm() {
    this.searchForm = this._formBuilder.group({
      saleID: new FormControl('', [Validators.required,Validators.pattern(/^\d+$/)]),
    });
  }

  validationInputInvoice(field: string): boolean {
    return this.searchForm.get(field).errors != undefined;
  }


  // initSiganR() {
  //   let connection = new HubConnectionBuilder()
  //     .withUrl(`${environment.url_base}Invoices`)
  //     .build();

  //   connection.on('SendInvoice', (data) => {
  //     let Invoice = data as InvoiceInfo;
  //     this.Invoices.data.unshift(Invoice);

  //     this.toastr.info("Folio:"+Invoice.invoiceID,"Nueva factura registrada.");
  //   });

  //   connection.start().then();
  // }

  // pageChange(page: any) {
  //   this.providerService
  //     .getInvoiceByPage((page - 1) * this.Invoices.pageSize)
  //     .subscribe((response) => {
  //       this.Invoices = response;
  //     });


  // }
}
