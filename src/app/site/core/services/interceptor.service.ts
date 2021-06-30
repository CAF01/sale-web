import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HelperService } from './helper.service';
import { finalize, tap } from "rxjs/operators";
import { SecurityHelper } from '../helpers/security-helper';
@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor{

  constructor(private helperService:HelperService) { }
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
   
   
    this.helperService.beginWorking();


    if(request.url.includes('/login')){

      request = request.clone({
        headers: request.headers
          .set('Content-Disposition', 'multipart/form-data')
          .set('Accept', 'application/json')
      });
    }else{
      request = request.clone({
        headers: request.headers
          .set('Content-Disposition', 'multipart/form-data')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${SecurityHelper.getToken()}`)
      });
    }

    
   

  


    return next.handle(request).pipe(
      tap((error) => {
       
      }),
      finalize(() => {
        this.helperService.stopWorking();
      })
    );
  }
}
