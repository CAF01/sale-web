import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { SecurityHelper } from '../helpers/security-helper';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardServiceService implements CanActivateChild {
  constructor(private router: Router) {}

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    let token = SecurityHelper.getToken();

    if(token)
    {
      return true;
    }

    this.router.navigate(['/account/login']);

    return false;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    let token = SecurityHelper.getToken();

    if (token) 
    {
      return true;
    }

    this.router.navigate(['/account/login']);

    return false;
  }
}
