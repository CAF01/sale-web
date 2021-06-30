import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { PaginationListResponse } from '../../core/models/pagination-list-response';
import { User } from '../models/entitys/user';
import { userInsertRequest } from '../models/request/userinsertrequest';
import { userUpdateRequest } from '../models/request/userupdaterequest';
import { AddressUpdateRequest } from '../models/request/addressupdaterequest';
import { AddressInsertRequest } from '../models/request/addressinsertrequest';
import { userSetStatRequest } from '../models/request/usersetstatrequest';
import { Token } from '../models/request/token';
import { UserLogin } from '../models/request/user-login';
import { UserInfo } from 'os';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  controller = 'User';
  controllerAddress = 'UserAddress';
  constructor(private _http: HttpClient) {}

  getUsers(): Observable<PaginationListResponse<User>> {
    return this._http.get<PaginationListResponse<User>>(
      `${environment.url_api}${this.controller}/users`
    );
  }

  getUsersByPage(page: number): Observable<PaginationListResponse<User>> {
    let params = new HttpParams().set('skip', page.toString());

    return this._http.get<PaginationListResponse<User>>(
      `${environment.url_api}${this.controller}/users`,
      { params: params }
    );
  }

  newUser(user: userInsertRequest): Observable<number> {
    return this._http.post<number>(
      `${environment.url_api}${this.controller}`,
      user
    );
  }

  newUserWithAddress(userWithAddress: userInsertRequest): Observable<number> {
    return this._http.post<number>(
      `${environment.url_api}${this.controller}/user-insert-address`,
      userWithAddress
    );
  }

  updateUser(user: userUpdateRequest): Observable<boolean> {
    return this._http.put<boolean>(
      `${environment.url_api}${this.controller}`,
      user
    );
  }

  updateAddress(address: AddressUpdateRequest): Observable<boolean> {
    return this._http.put<boolean>(
      `${environment.url_api}${this.controllerAddress}`,
      address
    );
  }

  InsertAddress(address: AddressInsertRequest): Observable<number> {
    return this._http.post<number>(
      `${environment.url_api}${this.controllerAddress}`,
      address
    );
  }

  deleteuser(request: userSetStatRequest): Observable<boolean> {
    return this._http.put<boolean>(
      `${environment.url_api}${this.controller}/user-status`,
      request
    );
  }

  Login(user:UserLogin): Observable<User> {
    return this._http.post<User>(`${environment.url_api}${this.controller}/login`,user);
  }
}
