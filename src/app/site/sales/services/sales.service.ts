import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
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

}
