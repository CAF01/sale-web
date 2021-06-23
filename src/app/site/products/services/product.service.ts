import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { InsertProductRequest } from '../models/insertproductrequest';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  controller = 'Product';

  constructor(private _http: HttpClient) { }

  newProduct(product: InsertProductRequest): Observable<number> {
    return this._http.post<number>(
      `${environment.url_api}${this.controller}`,product
    );
  }

  Upload(image:FormData):Observable<string>
  {
    return this._http.post<string>(
      `${environment.url_api}${this.controller}/upload`,image
    );
  }
}
