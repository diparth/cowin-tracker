import { Utils } from './../helpers/utils';
import { Router } from '@angular/router';
import { LocalStorageService } from './local-storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../helpers/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private router: Router) {
  }

  public setUpLocalStore(newData: any): void {
    const existingCreds = JSON.parse(localStorage.getItem('login_creds'));
    localStorage.setItem('login_creds', JSON.stringify({ ...existingCreds, ...newData }));
  }

  public loginWithNumber(body: any): Observable<any> {
    const headers = new HttpHeaders();
    body = {
      secret: this.secretKey,
      mobile: body.mobile
    };

    return this.http.post(`/api/v2/auth/generateMobileOTP`, body, { headers });
  }

  public loginWithOTP(body): Observable<any> {

    return this.http.post(`/api/v2/auth/validateMobileOtp`, body);
  }

  public logout(): void {
    localStorage.removeItem('login_creds');
    localStorage.removeItem('user_details');

    this.router.navigate(['login']);
  }

  public get accessToken(): string {
    const localData = JSON.parse(localStorage.getItem('login_creds'));

    return Utils.isNullOrUndefined(localData) ? undefined : `Bearer ${localData.token}`;
  }

  public get txnId(): string {
    const localData = JSON.parse(localStorage.getItem('login_creds'));

    return Utils.isNullOrUndefined(localData) ? undefined : localData.txn_id;
  }

  public get isLoggedIn(): boolean {
    return !Utils.isNullOrUndefined(this.accessToken) && !Utils.isNullOrUndefined(this.txnId);
  }

  private get loginCreds(): any {
    return JSON.parse(localStorage.getItem('login_creds'));
  }

  private get secretKey(): string {
    const existingSecretKey = this.localStorageService.getFromLocalStorage('secret_key');

    if(Utils.isNullOrUndefined(existingSecretKey)) {
      const scKey = "U2FsdGVkX18BYi2wPdSgIOI4TyVT0kIavMTI8eK/4Qr+eOVTP7N7EcRUaSMJrgv3h9ma1jFdNeE7YiF4fcqgNQ==";
      this.localStorageService.addToLocalStorage('secret_key', scKey);

      return scKey;
    } else {
      return existingSecretKey;
    }
  }
}
