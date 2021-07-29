import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaginationListResponse } from '../../core/models/pagination-list-response';
import { ContentSaleInfo } from '../models/entitys/contentsaleinfo';
import { PaymentHistorialInfo } from '../models/entitys/paymenthistorialinfo';
import { PendingPaymentInfo } from '../models/entitys/pendingpaymentinfo';
import { SalesInfo } from '../models/entitys/salesinfo';
import { InsertPaymentHistorialRequest } from '../models/request/insertpaymenthistorialrequest';
import { InsertSaleRequest } from '../models/request/insertsalerequest';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  controller = 'Sale';
  constructor(private _http: HttpClient) {}

  CreateSale(saleRequest: InsertSaleRequest): Observable<number> {
    return this._http.post<number>(
      `${environment.url_api}${this.controller}`,saleRequest
    );
  }

  GetSales():Observable<PaginationListResponse<SalesInfo>>
  {
    return this._http.get<PaginationListResponse<SalesInfo>>(
      `${environment.url_api}${this.controller}`
    );
  }
  GetSalesByPage(page:number):Observable<PaginationListResponse<SalesInfo>>
  {
    let params = new HttpParams().set('skip',page.toString());
    return this._http.get<PaginationListResponse<SalesInfo>>(
      `${environment.url_api}${this.controller}`,{params:params}
    );
  }

  GetPendingPayments():Observable<PaginationListResponse<PendingPaymentInfo>>
  {
    return this._http.get<PaginationListResponse<PendingPaymentInfo>>(
      `${environment.url_api}${this.controller}/get-pending-payments`
    );
  }

  getSaleByID(id:number):Observable<SalesInfo>
  {
    let params = new HttpParams().set('id', id.toString());

    return this._http.get<SalesInfo>(
      `${environment.url_api}${this.controller}/find-sale`,{params:params}
    );
  }

  
  getContentSaleByID(id:number):Observable<ContentSaleInfo[]>
  {
    let params = new HttpParams().set('id', id.toString());

    return this._http.get<ContentSaleInfo[]>(
      `${environment.url_api}${this.controller}/content-by-id`,{params:params}
    );
  }

  getHistorialByID(id:number):Observable<PaymentHistorialInfo[]>
  {
    let params = new HttpParams().set('id', id.toString());

    return this._http.get<PaymentHistorialInfo[]>(
      `${environment.url_api}${this.controller}/get-historial-by-id`,{params:params}
    );
  }

  newPayHistorial(pay:InsertPaymentHistorialRequest):Observable<number>
  {
    return this._http.post<number>(
      `${environment.url_api}${this.controller}/add-payment-historial`,pay
    )
  }

}
