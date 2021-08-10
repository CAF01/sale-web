import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HelperService } from './helper.service';
import { catchError, finalize, tap } from 'rxjs/operators';
import { SecurityHelper } from '../helpers/security-helper';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
  constructor(private helperService: HelperService, private router: Router) {}

  private handleAuthError(err: HttpErrorResponse): Observable<any>
   {
    //handle your auth error or rethrow
    if (err.status === 401 || err.status === 403) {
      SecurityHelper.deleteToken();

      this.router.navigate(['/account/login']);

      return of(err.message); // or EMPTY may be appropriate here
    }
    return throwError(err);
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.helperService.beginWorking();

    if (request.url.includes('/login')) 
    {
      request = request.clone({
        headers: request.headers
          .set('Content-Disposition', 'multipart/form-data')
          .set('Accept', 'application/json'),
      });
    } 
    else 
    {
      request = request.clone({
        headers: request.headers
          .set('Content-Disposition', 'multipart/form-data')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${SecurityHelper.getToken()}`),
      });
    }

    return next.handle(request).pipe(
      catchError((error) => this.handleAuthError(error)),
      tap((error) => {}),
      finalize(() => {
        this.helperService.stopWorking();
      })
    );
  }
}
