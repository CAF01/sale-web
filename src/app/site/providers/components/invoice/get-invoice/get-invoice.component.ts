import { Component, OnInit } from '@angular/core';
import { PaginationListResponse } from 'src/app/site/core/models/pagination-list-response';
import { InvoiceInfo } from '../../../models/entitys/invoiceinfo';
import { ProviderService } from '../../../services/provider.service';
import * as Feather from 'feather-icons';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidateForm } from 'src/app/site/core/helpers/validate-formfields-helper';

@Component({
  selector: 'app-get-invoice',
  templateUrl: './get-invoice.component.html',
  styleUrls: ['./get-invoice.component.scss']
})
export class GetInvoiceComponent implements OnInit {

  validateForm = ValidateForm;
  
  searchForm:FormGroup;

  page: number = 1;

  Invoices : PaginationListResponse<InvoiceInfo> | undefined;

  constructor(private providerService:ProviderService,
    private router: Router,
    private toastr : ToastrService,
    private _formBuilder: FormBuilder,) { }

  ngOnInit(): void {
    Feather.replace();
    this.getInvoices();
    moment().locale('es');
    this.initSiganR();
    this.SetSearchForm();
  }

  getInvoices()
  {
    this.providerService.getAllInvoices().subscribe(request=>
      {
        this.Invoices=request;
      },error=>
      {
        console.log(error);
      });
  }

  formatDate(date: Date) {
    return new Date(date);
  }

  openInvoice(invoice:InvoiceInfo)
  {
    this.router.navigate(['home/providers/content-invoice'], {
      queryParams: { invoice: JSON.stringify(invoice) },
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
      this.providerService.getAnInvoiceByID(this.searchForm.get('invoiceID').value).subscribe(request=>
        {
          this.openInvoice(request);
        },error=>
        {
          // console.log(error);
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
      invoiceID: new FormControl('', [Validators.required,Validators.pattern(/^\d+$/)]),
    });
  }

  validationInputInvoice(field: string): boolean {
    return this.searchForm.get(field).errors != undefined;
  }


  initSiganR() {
    let connection = new HubConnectionBuilder()
      .withUrl(`${environment.url_base}Invoices`)
      .build();

    connection.on('SendInvoice', (data) => {
      let Invoice = data as InvoiceInfo;
      this.Invoices.data.unshift(Invoice);

      this.toastr.info("Folio:"+Invoice.invoiceID,"Nueva factura registrada.");
    });

    connection.start().then();
  }

  pageChange(page: any) {
    this.providerService
      .getInvoiceByPage((page - 1) * this.Invoices.pageSize)
      .subscribe((response) => {
        this.Invoices = response;
      });


  }
}
