import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StatusRequest } from '../models/request/statusrequest';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  controller = 'ExcelDocuments';
  constructor(private _http: HttpClient) {}

  downloadReportSale(request: StatusRequest): Observable<any> {
    let params = new HttpParams().set('option',"0");
    return this._http.post(
      `${environment.url_api}${this.controller}/export-metrics`, request, {
      responseType: "blob",params:params
    });
  }
  downloadReportSaleMonth(request: StatusRequest): Observable<any> {
    let params = new HttpParams().set('option',"1");
    return this._http.post(
      `${environment.url_api}${this.controller}/export-metrics`, request, {
      responseType: "blob",params:params
    });
  }
  downloadReportSaleYear(request: StatusRequest): Observable<any> {
    let params = new HttpParams().set('option',"2");
    return this._http.post(
      `${environment.url_api}${this.controller}/export-metrics`, request, {
      responseType: "blob",params:params
    });
  }
  
  downloadReportProductivity(request: StatusRequest): Observable<any> {
    let params = new HttpParams().set('option',"3");
    return this._http.post(
      `${environment.url_api}${this.controller}/export-metrics`, request, {
      responseType: "blob",params:params
    });
  }
  downloadReportPendings(request: StatusRequest): Observable<any> {
    let params = new HttpParams().set('option',"4");
    return this._http.post(
      `${environment.url_api}${this.controller}/export-metrics`,request, {
      responseType: "blob",params:params
    });
  }
}
