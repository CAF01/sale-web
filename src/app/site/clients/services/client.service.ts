import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ReasonReturnInfo } from '../../catalogs/models/entitys/reasonreturninfo';
import { PaginationListResponse } from '../../core/models/pagination-list-response';
import { client } from '../models/entitys/client';
import { ProductReturned } from '../models/entitys/productreturned';
import { insertAddressClientRequest } from '../models/request/insertaddressclientrequest';
import { insertClientRequest } from '../models/request/insertclientrequest';
import { InsertReturnClientRequest } from '../models/request/insertreturnclientrequest';
import { setStatusClientRequest } from '../models/request/setstatusclient';
import { updateAddressClientRequest } from '../models/request/updateaddressclientrequest';
import { updateClientRequest } from '../models/request/updateclientrequest';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  controller = 'Client';
  controllerReturn = 'ReturnClient';
  controllerAddress = 'ClientAddress';
  controllerReason = 'ReasonReturnClient';
  constructor(private _http: HttpClient) {}

    newClient(Client: insertClientRequest): Observable<number> {
    return this._http.post<number>(
      `${environment.url_api}${this.controller}`,Client
    );
    }

    newClientWithAddress(Client:insertClientRequest):Observable<number>{
      return this._http.post<number>(
        `${environment.url_api}${this.controller}/client-address`,Client
      );
    }

    getClients(): Observable<PaginationListResponse<client>> {
      return this._http.get<PaginationListResponse<client>>(
        `${environment.url_api}${this.controller}`
      );
    }

    updateClient(client: updateClientRequest): Observable<boolean> {
      return this._http.put<boolean>(
        `${environment.url_api}${this.controller}`,
        client
      );
    }
  
    updateAddress(address: updateAddressClientRequest): Observable<boolean> {
      return this._http.put<boolean>(
        `${environment.url_api}${this.controllerAddress}`,
        address
      );
    }
  
    InsertAddress(address: insertAddressClientRequest): Observable<number> {
      return this._http.post<number>(
        `${environment.url_api}${this.controllerAddress}`,
        address
      );
    }

    deleteClient(request: setStatusClientRequest): Observable<boolean> {
      return this._http.put<boolean>(
        `${environment.url_api}${this.controller}/client-status`,
        request
      );
    }

    getClientsByPage(page: number): Observable<PaginationListResponse<client>> {
      let params = new HttpParams().set('skip', page.toString());
      return this._http.get<PaginationListResponse<client>>(
        `${environment.url_api}${this.controller}`,{ params: params }
      );
    }


    getClientsByPhone(Phone: string): Observable<client> {
      let params = new HttpParams().set('Phone', Phone);
      return this._http.get<client>(
        `${environment.url_api}${this.controller}/find-by-phone`,{ params: params }
      );
    }

    getClientByPhonePipe(phone:string):Observable<client[]>
    {
      let params = new HttpParams().set('phone', phone);
      return this._http.get<client[]>(
        `${environment.url_api}${this.controller}/get-by-phone`,{ params: params }
      ).pipe
        (map(response=>response)
      );
    }

    getClientByLastNamePipe(lastname:string):Observable<client[]>
    {
      let params = new HttpParams().set('lastname', lastname);
      return this._http.get<client[]>(
        `${environment.url_api}${this.controller}/get-by-lastname`,{ params: params }
      ).pipe
        (map(response=>response)
      );
    }

    newReturn(request: InsertReturnClientRequest[]): Observable<number> {
      return this._http.post<number>(
        `${environment.url_api}${this.controllerReturn}`,request
      );
    }

    getReasons(): Observable<ReasonReturnInfo[]> {
      return this._http.get<ReasonReturnInfo[]>(
        `${environment.url_api}${this.controllerReason}`
      );
    }

    getReturnedProds(id:number): Observable<ProductReturned[]> {
      let params = new HttpParams().set('id', id.toString());
      return this._http.get<ProductReturned[]>(
        `${environment.url_api}${this.controllerReturn}/get-product-returneds`,{params:params}
      );
    }
  

}
