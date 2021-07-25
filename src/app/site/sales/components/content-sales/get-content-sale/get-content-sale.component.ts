import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ContentSaleInfo } from '../../../models/entitys/contentsaleinfo';
import { SalesInfo } from '../../../models/entitys/salesinfo';
import { SalesService } from '../../../services/sales.service';

@Component({
  selector: 'app-get-content-sale',
  templateUrl: './get-content-sale.component.html',
  styleUrls: ['./get-content-sale.component.scss']
})
export class GetContentSaleComponent implements OnInit {

  saleInfo : SalesInfo;
  // providerInfo: ProviderInfo;

  contentSale : Array<ContentSaleInfo>;
  IVA=16;
  IVACost:number;

  constructor(
    private _route: ActivatedRoute,
    private saleService:SalesService,
    private router:Router
  ) { }

  ngOnInit(): void {

    this._route.queryParams.subscribe((params) => {
      if (params.sale) {
        this.saleInfo = JSON.parse(params.sale) as SalesInfo;
        let saleID=this.saleInfo.saleID;
        this.IVACost=parseFloat((this.saleInfo.totalIVA-this.saleInfo.total).toFixed(2));
        this.getContentSale(saleID);
      }
      else
      {
        this.router.navigate(['home/sales/list']);
      }
    });

    moment().locale('es');
  }

  // getInfoProvider(id:number)
  // {
  //   this.providerService.getInfoProviderByID(id).subscribe(request=>
  //     {
  //       this.providerInfo=request;
  //     },error=>
  //     {
  //       console.log(error);
  //     });
  // }

  async getContentSale(id:number)
  {
    var response = await this.saleService.getContentSaleByID(id).toPromise();
    if(response.length>0)
    {
      this.contentSale=response;
      console.log(response);
    }
  }

  formatDate(date: Date) {
    return new Date(date);
  }

}
