import { Component, OnInit } from '@angular/core';
import * as Feather from 'feather-icons';
import * as moment from 'moment';
import { PaginationListResponse } from 'src/app/site/core/models/pagination-list-response';
import { ReturnProductProviderInfo } from '../../../models/entitys/returnproductproviderinfo';
import { ProviderService } from '../../../services/provider.service';

@Component({
  selector: 'app-get-returnprovider',
  templateUrl: './get-returnprovider.component.html',
  styleUrls: ['./get-returnprovider.component.scss']
})
export class GetReturnproviderComponent implements OnInit {

  constructor(private providerService:ProviderService) { }
  historial : PaginationListResponse<ReturnProductProviderInfo>;

  page: number = 1;

  ngOnInit(): void {
    Feather.replace();
    moment().locale('es');
    this.getHistorialReturns();
  }

  formatDate(date: Date) {
    return new Date(date);
  }

  getHistorialReturns()
  {
    this.providerService.getHistorialReturnsToProvier().subscribe(request=>
      {
        this.historial=request;
      },
      error=>console.log(error));
  }

  pageChange(page: any) {
    this.providerService
      .getHistorialReturnsToProvierByPage((page - 1) * this.historial.pageSize)
      .subscribe((response) => {
        this.historial = response;
      });
  }
}
