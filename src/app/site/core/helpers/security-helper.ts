export class SecurityHelper {
  private static readonly TOKEN = 'token';

  public static setTokenStorage(token: string) {
    localStorage.setItem(this.TOKEN, token);
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
  }
}
