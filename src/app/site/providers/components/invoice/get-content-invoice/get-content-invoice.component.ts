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

  async getInfoProvider(id:number)
  {
    let request = await this.providerService.getInfoProviderByID(id).toPromise();
    this.providerInfo=request;
  }

  async getContentInvoice(id:number)
  {
    let request = await this.providerService.getContentInvoice(id).toPromise();
    this.contentInvoice=request;
    this.Subtotal= parseFloat(this.contentInvoice.data[0].total.toFixed(2));
    this.CostIVA=parseFloat((this.Subtotal*(this.IVA/100)).toFixed(2));
    this.Total=parseFloat((this.Subtotal+this.CostIVA).toFixed(2));
  }

  formatDate(date: Date) {
    return new Date(date);
  }

}
