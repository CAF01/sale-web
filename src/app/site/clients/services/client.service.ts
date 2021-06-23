import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaginationListResponse } from '../../core/models/pagination-list-response';
import { client } from '../models/entitys/client';
import { insertAddressClientRequest } from '../models/request/insertaddressclientrequest';
import { insertClientRequest } from '../models/request/insertclientrequest';
import { setStatusClientRequest } from '../models/request/setstatusclient';
import { updateAddressClientRequest } from '../models/request/updateaddressclientrequest';
import { updateClientRequest } from '../models/request/updateclientrequest';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  controller = 'Client';

  controllerAddress = 'ClientAddress';
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

 

}
