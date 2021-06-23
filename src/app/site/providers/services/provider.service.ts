import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { insertProviderRequest } from '../models/request/insertproviderrequest';
import { PaginationListResponse } from '../../core/models/pagination-list-response';
import { ProviderInfo } from '../models/entitys/provider';
import { updateProviderRequest } from '../models/request/updateproviderrequest';
import { setStatusProviderRequest } from '../models/request/setstatusproviderrequest';


@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  controller = 'Provider';

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
}
