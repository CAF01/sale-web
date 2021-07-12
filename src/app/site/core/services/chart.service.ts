import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChartSale } from '../models/chart-sale';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  controller = 'Chart';
  constructor(private _http: HttpClient) {}

    getChart(id:number):Observable<ChartSale[]>
    {
      let params = new HttpParams().set('id', id.toString());
      return this._http.get<ChartSale[]>(
        `${environment.url_api}${this.controller}`,{params:params}
      );
    }

  }
