import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { PaginationListResponse } from 'src/app/site/core/models/pagination-list-response';
import { InvoiceContentInfo } from '../../../models/entitys/invoicecontentinfo';
import { InvoiceInfo } from '../../../models/entitys/invoiceinfo';
import { ProviderInfo } from '../../../models/entitys/provider';
import { ProviderService } from '../../../services/provider.service';

@Component({
  selector: 'app-get-content-invoice',
  templateUrl: './get-content-invoice.component.html',
  styleUrls: ['./get-content-invoice.component.scss']
})
export class GetContentInvoiceComponent implements OnInit {

  invoiceInfo : InvoiceInfo;
  providerInfo: ProviderInfo;

  contentInvoice : PaginationListResponse<InvoiceContentInfo>;
  Total:number;
  IVA:number=16;
  CostIVA:number;

  Subtotal:number;


  constructor(
    private _route: ActivatedRoute,
    private providerService:ProviderService,
    private router:Router
  ) { }

  ngOnInit(): void {

    this._route.queryParams.subscribe((params) => {
      if (params.invoice) {
        this.invoiceInfo = JSON.parse(params.invoice) as InvoiceInfo;
        let invoiceID=this.invoiceInfo.invoiceID;
        this.getInfoProvider(invoiceID);
        this.getContentInvoice(invoiceID);
      }
      else
      {
        this.router.navigate(['home/providers/list-invoice']);
      }
    });

    moment().locale('es');
  }

  getInfoProvider(id:number)
  {
    this.providerService.getInfoProviderByID(id).subscribe(request=>
      {
        this.providerInfo=request;
      },error=>
      {
        console.log(error);
      });
  }

  getContentInvoice(id:number)
  {
    this.providerService.getContentInvoice(id).subscribe(request=>
      {
        this.contentInvoice=request;
        this.Subtotal=this.contentInvoice.data[0].total;
        this.CostIVA=this.Subtotal*(this.IVA/100);
        this.Total=this.Subtotal+this.CostIVA;
      },
      error=>
      {
        console.log(error);
      });
  }

  formatDate(date: Date) {
    return new Date(date);
  }

}
