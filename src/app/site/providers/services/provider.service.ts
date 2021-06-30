import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { insertProviderRequest } from '../models/request/insertproviderrequest';
import { PaginationListResponse } from '../../core/models/pagination-list-response';
import { ProviderInfo } from '../models/entitys/provider';
import { updateProviderRequest } from '../models/request/updateproviderrequest';
import { setStatusProviderRequest } from '../models/request/setstatusproviderrequest';
import { InsertInvoiceRequest } from '../models/request/insertinvoicerequest';
import { InvoiceInfo } from '../models/entitys/invoiceinfo';
import { InvoiceContentInfo } from '../models/entitys/invoicecontentinfo';


@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  controller = 'Provider';
  controllerInvoice = 'Invoice';

  constructor(private _http: HttpClient) { }

  newUser(provider: insertProviderRequest): Observable<number> {
    return this._http.post<number>(
      `${environment.url_api}${this.controller}`,provider
    );
  }

  getProviders():Observable<PaginationListResponse<ProviderInfo>>
  {
    return this._http.get<PaginationListResponse<ProviderInfo>>(
      `${environment.url_api}${this.controller}`
    );
  }

  updateUser(provider:updateProviderRequest):Observable<boolean>{
    return this._http.put<boolean>(
      `${environment.url_api}${this.controller}`,provider
    );
  }

  setStatus(request : setStatusProviderRequest):Observable<boolean>
  {
    return this._http.put<boolean>(
      `${environment.url_api}${this.controller}/set-status`,request
    );
  }

  getProvidersByPage(page: number): Observable<PaginationListResponse<ProviderInfo>> {
    let params = new HttpParams().set('skip', page.toString());

    return this._http.get<PaginationListResponse<ProviderInfo>>(
      `${environment.url_api}${this.controller}`,{ params: params }
    );
  }

  getAvailableProviders():Observable<ProviderInfo[]>
  {
    return this._http.get<ProviderInfo[]>(
      `${environment.url_api}${this.controller}/available-providers`
    );
  }

  insertInvoice(Invoice:InsertInvoiceRequest):Observable<number>
  {
    return this._http.post<number>(
      `${environment.url_api}${this.controllerInvoice}`,Invoice
    )
  }

  getAllInvoices():Observable<PaginationListResponse<InvoiceInfo>>
  {
    return this._http.get<PaginationListResponse<InvoiceInfo>>(
      `${environment.url_api}${this.controllerInvoice}/all-invoice`
    );
  }

  getInfoProviderByID(id: number): Observable<ProviderInfo> {
    let params = new HttpParams().set('id', id.toString());

    return this._http.get<ProviderInfo>(
      `${environment.url_api}${this.controllerInvoice}/info-provider`,{ params: params }
    );
  }

  getAnInvoiceByID(id: number): Observable<InvoiceInfo> {
    let params = new HttpParams().set('id', id.toString());

    return this._http.get<InvoiceInfo>(
      `${environment.url_api}${this.controllerInvoice}/invoice-info`,{ params: params }
    );
  }

  getContentInvoice(id:number):Observable<PaginationListResponse<InvoiceContentInfo>>
  {
    let params = new HttpParams().set('id', id.toString());
    return this._http.get<PaginationListResponse<InvoiceContentInfo>>(
      `${environment.url_api}${this.controllerInvoice}`,{params:params}
    );
  }

  getInvoiceByPage(page: number): Observable<PaginationListResponse<InvoiceInfo>> {
    let params = new HttpParams().set('skip', page.toString());

    return this._http.get<PaginationListResponse<InvoiceInfo>>(
      `${environment.url_api}${this.controllerInvoice}/all-invoice`,
      { params: params }
    );
  }
}
