import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { PaginationListResponse } from '../../models/pagination-list-response';
import { User } from '../models/entitys/user';
import { userInsertRequest } from '../models/request/userinsertrequest';
import { UserAddressInfo } from '../models/entitys/user-address-info';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  controller = 'User';
  controllerAddress='UserAddress';
  constructor(private _http: HttpClient) {}

  getUsers(): Observable<PaginationListResponse<User>> {
    return this._http.get<PaginationListResponse<User>>(
      `${environment.url_api}${this.controller}/users`
    );
  }

  getAddressbyID(id:number): Observable<UserAddressInfo>
  {
    let headerss = new HttpHeaders();
      headerss.append('Content-Type', 'application/json');
      headerss.append('id', id.toString());
    let params = new HttpParams().set('id', id.toPrecision());
    return this._http.get<UserAddressInfo>(
      `${environment.url_api}${this.controllerAddress}`,{headers:headerss,params:params});
  }

  newUser(user: userInsertRequest): Observable<number> {
    return this._http.post<number>(
      `${environment.url_api}${this.controller}`,user
    );
  }

  newUserWithAddress(userWithAddress: userInsertRequest):Observable<number> {
    return this._http.post<number>(
      `${environment.url_api}${this.controller}/user-insert-address`,userWithAddress
    );
  }
}
