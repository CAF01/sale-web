import { Router } from "@angular/router";
import { User } from "../../users/models/entitys/user";

export class SecurityHelper {
  private static readonly TOKEN = 'token';
  private static readonly EMAIL = 'email';
  private static readonly NAME = 'name';
  private static readonly USERID = 'userid';

  constructor( private router: Router){

  }

  public static setTokenStorage(token: User) {
    localStorage.setItem(this.TOKEN, token.token);
    localStorage.setItem(this.EMAIL,token.email);
    localStorage.setItem(this.NAME,(token.firstName +' '+ token.lastName));
    localStorage.setItem(this.USERID,token.userID.toString());
  }

  public static getToken(): string {
    let token = localStorage.getItem(this.TOKEN);
    if (token) {
      return token;
    }

    return null;
  }

  public static deleteToken() {
    localStorage.removeItem(this.TOKEN);
    localStorage.removeItem(this.EMAIL);
    localStorage.removeItem(this.NAME);
    localStorage.removeItem(this.USERID);
  }
}
//Guardar info usuario.
