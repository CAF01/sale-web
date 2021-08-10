import { Router } from "@angular/router";
import { User } from "../../users/models/entitys/user";

type UserSession = {
                    token:string,
                    email:string,
                    name:string,
                    userID:number,
                    changePassword:boolean
                    }; 

export class SecurityHelper {
  private static readonly TOKEN = 'token';

  constructor( private router: Router){

  }

  public static setTokenStorage(token: User) {
    let obj : UserSession ={
      token:token.token,
      email:token.email,
      name:token.firstName+' '+token.lastName,
      userID:token.userID,
      changePassword:token.changePassword
    };
    localStorage.setItem(this.TOKEN,JSON.stringify(obj));
  }

  public static getToken(): string {
    let token = JSON.parse(localStorage.getItem(this.TOKEN)) as UserSession;
    if (token) {
      return token.token;
    }

    return null;
  }

  public static SetStatusChangeToFalse()
  {
    let obj :UserSession;
    obj = JSON.parse(localStorage.getItem(this.TOKEN)) as UserSession;
    obj.changePassword=false;
    localStorage.setItem(this.TOKEN,JSON.stringify(obj));
  }

  public static deleteToken() {
    localStorage.removeItem(this.TOKEN);
  }
}
//Guardar info usuario.
