import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HelperService } from './helper.service';
import { finalize, tap } from "rxjs/operators";
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

    return next.handle(request).pipe(
      tap((error) => {
       
      }),
      finalize(() => {
        this.helperService.stopWorking();
      })
    );
  }
}
