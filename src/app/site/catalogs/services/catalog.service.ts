import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaginationListResponse } from '../../core/models/pagination-list-response';
import { BrandInfo } from '../models/entitys/brandinfo';
import { CategoryInfo } from '../models/entitys/categoryinfo';
import { PaymentMethodInfo } from '../models/entitys/paymentmethodinfo';
import { brandInsertRequest } from '../models/request/brandinsertrequest';
import { brandSetStatusRequest } from '../models/request/brandsetstatusrequest';
import { brandUpdateRequest } from '../models/request/brandupdaterequest';
import { categoryInsertRequest } from '../models/request/categoryinsertrequest';
import { categorySetStatusRequest } from '../models/request/categorysetstatusrequest';
import { categoryUpdateRequest } from '../models/request/categoryupdaterequest';
import { DeleteRequest } from '../models/request/deleteRequest';
import { paymentInsertRequest } from '../models/request/paymentinsertrequest';
import { paymentSetStatusRequest } from '../models/request/paymentsetstatusrequest';
import { paymentUpdateRequest } from '../models/request/paymentupdaterequest';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  brandController = 'Brand';
  categoryController = 'Category';
  paymentController = 'PaymentMethod';

  constructor(private _http: HttpClient) { }

 

  getBrands():Observable<PaginationListResponse<BrandInfo>>
  {
    return this._http.get<PaginationListResponse<BrandInfo>>(
      `${environment.url_api}${this.brandController}`
    );
  }

  getCategories():Observable<PaginationListResponse<CategoryInfo>>
  {
    return this._http.get<PaginationListResponse<CategoryInfo>>(
      `${environment.url_api}${this.categoryController}`
    );
  }

  getPaymentMethods():Observable<PaymentMethodInfo[]>
  {
    return this._http.get<PaymentMethodInfo[]>(
      `${environment.url_api}${this.paymentController}`
    );
  }

  inserBrand(brand:brandInsertRequest):Observable<number>
  {
    return this._http.post<number>(
      `${environment.url_api}${this.brandController}`,brand
    );
  }

  insertCategory(category:categoryInsertRequest):Observable<number>
  {
    return this._http.post<number>(
      `${environment.url_api}${this.categoryController}`,category
    );
  }

  insertPaymentMethod(payment : paymentInsertRequest):Observable<number>
  {
    return this._http.post<number>(
      `${environment.url_api}${this.paymentController}`,payment
    )
  }

  deleteBrand(delBrand : brandSetStatusRequest):Observable<boolean>
  {
    return this._http.put<boolean>(
      `${environment.url_api}${this.brandController}`,delBrand
    )
  }
  
  deleteCategory(delCategory : categorySetStatusRequest):Observable<boolean>
  {
    return this._http.put<boolean>(
      `${environment.url_api}${this.categoryController}/set-status`,delCategory
    )
  }

  deletePayment(delPayment : paymentSetStatusRequest):Observable<boolean>
  {
    return this._http.put<boolean>(
      `${environment.url_api}${this.paymentController}/set-status`,delPayment
    )
  }

  updateBrand(updBrand:brandUpdateRequest):Observable<boolean>
  {
    return this._http.put<boolean>(
      `${environment.url_api}${this.brandController}/UpdateBrand`,updBrand
    )
  }

  updateCategory(updCategory:categoryUpdateRequest):Observable<boolean>
  {
    return this._http.put<boolean>
    (
      `${environment.url_api}${this.categoryController}`,updCategory
    )
  }

  updatePayment(updPayment:paymentUpdateRequest):Observable<boolean>
  {
    return this._http.put<boolean>
    (
      `${environment.url_api}${this.paymentController}`,updPayment
    )
  }

  Upload(image:FormData):Observable<string>
  {
    return this._http.post<string>(
      `${environment.url_api}${this.brandController}/upload`,image
    );
  }

  deletePhoto(deleteR:DeleteRequest):Observable<boolean>{
    return this._http.post<boolean>(
      `${environment.url_api}${this.brandController}/delete`,deleteR
    );
  }

}
