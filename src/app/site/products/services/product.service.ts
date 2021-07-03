import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DeleteRequest } from '../../catalogs/models/request/deleteRequest';
import { PaginationListResponse } from '../../core/models/pagination-list-response';
import { GetProductRequest } from '../../providers/models/request/getproductrequest';
import { InsertProductRequest } from '../models/insertproductrequest';
import { ProductInfo } from '../models/productInfo';
import { SetStatusProductRequest } from '../models/setstatusproductrequest';
import { UpdateProductRequest } from '../models/updateproductrequest';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  controller = 'Product';

  constructor(private _http: HttpClient) { }

  getProducts():Observable<PaginationListResponse<ProductInfo>>
  {
    return this._http.get<PaginationListResponse<ProductInfo>>(
      `${environment.url_api}${this.controller}`
    )
  }

  newProduct(product: InsertProductRequest): Observable<number> {
    return this._http.post<number>(
      `${environment.url_api}${this.controller}`,product
    );
  }

  updateProduct(product: UpdateProductRequest): Observable<boolean> {
    return this._http.put<boolean>(
      `${environment.url_api}${this.controller}`,product
    );
  }

  Upload(image:FormData):Observable<string>
  {
    return this._http.post<string>(
      `${environment.url_api}${this.controller}/upload`,image
    );
  }

  deletePhoto(deleteR:DeleteRequest):Observable<boolean>{
    return this._http.post<boolean>(
      `${environment.url_api}${this.controller}/delete`,deleteR
    );
  }

  getAvailableProducts():Observable<ProductInfo[]>
  {
    return this._http.get<ProductInfo[]>(
      `${environment.url_api}${this.controller}/available-products`
    );
  }

  getProductByName(name:GetProductRequest):Observable<ProductInfo[]>
  {
    let params = new HttpParams().set('ProductName', name.productName.toString());
    return this._http.get<ProductInfo[]>(
      `${environment.url_api}${this.controller}/get-by-name`,{ params: params }
    );
  }

  getProductByCode(code:GetProductRequest):Observable<ProductInfo[]>
  {
    let params = new HttpParams().set('Code', code.code.toString());
    return this._http.get<ProductInfo[]>(
      `${environment.url_api}${this.controller}/get-by-code`,{ params: params }
    );
  }

  getProductsByPage(page: number): Observable<PaginationListResponse<ProductInfo>> {
    let params = new HttpParams().set('skip', page.toString());

    return this._http.get<PaginationListResponse<ProductInfo>>(
      `${environment.url_api}${this.controller}`,{ params: params }
    );
  }

  setStatusProduct(request:SetStatusProductRequest):Observable<boolean>
  {
    return this._http.put<boolean>(
      `${environment.url_api}${this.controller}/set-status`,request
    )
  }
}
