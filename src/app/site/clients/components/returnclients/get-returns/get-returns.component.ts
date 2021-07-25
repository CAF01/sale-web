import { Component, OnInit } from '@angular/core';
import { PaginationListResponse } from 'src/app/site/core/models/pagination-list-response';
import { ReturnProductClientInfo } from '../../../models/entitys/returnproductclientinfo';
import { ClientService } from '../../../services/client.service';
import * as Feather from 'feather-icons';
import * as moment from 'moment';

@Component({
  selector: 'app-get-returns',
  templateUrl: './get-returns.component.html',
  styleUrls: ['./get-returns.component.scss']
})
export class GetReturnsComponent implements OnInit {

  constructor(private clientService:ClientService) { }
  historial : PaginationListResponse<ReturnProductClientInfo>;

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
    this.clientService.getHistorialReturns().subscribe(request=>
      {
        this.historial=request;
      },error=>console.log(error));
  }

  pageChange(page: any) {
    this.clientService
      .getHistorialReturnsByPage((page - 1) * this.historial.pageSize)
      .subscribe((response) => {
        this.historial = response;
      });
  }
}
