import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { PaginationListResponse } from '../../models/pagination-list-response';
import { User } from '../models/entitys/user';



@Injectable({
  providedIn: 'root',
})
export class UserService {
  controller = 'User';
  constructor(private _http: HttpClient) {}

  getUsers(): Observable<PaginationListResponse<User>> {

    console.log(`${environment.url_api}${this.controller}/users`);

    return this._http.get<PaginationListResponse<User>>(`${environment.url_api}${this.controller}/users`);
  }
}
