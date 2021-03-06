import { Utils } from './../helpers/utils';
import { Router } from '@angular/router';
import { LocalStorageService } from './local-storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_BASE_URL } from '../helpers/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  public logoutCounter: BehaviorSubject<number> = new BehaviorSubject(undefined);

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

    return this.http.post(`${API_BASE_URL}/api/v2/auth/generateMobileOTP`, body, { headers });
  }

  public loginWithOTP(body): Observable<any> {

    return this.http.post(`${API_BASE_URL}/api/v2/auth/validateMobileOtp`, body).pipe(map(res => {
      const timestamp = Math.floor((new Date()).getTime());
      this.logoutCounter.next(timestamp);

      return res;
    }));
  }

  public logout(): void {
    localStorage.clear();

    this.logoutCounter.next(0);
    this.router.navigate(['login']);

    const logoutToneElem: HTMLElement | any = document.getElementById('logoutTone');
    logoutToneElem.play().then(() => {
      window.location.reload();
    });
  }

  public get accessToken(): string {
    const localData = JSON.parse(localStorage.getItem('login_creds'));

    return Utils.isNullOrUndefined(localData) ? undefined : (Utils.isNullOrUndefined(localData.token) ? undefined : `Bearer ${localData.token}`);
  }

  public get txnId(): string {
    const localData = JSON.parse(localStorage.getItem('login_creds'));

    return Utils.isNullOrUndefined(localData) ? undefined : localData.txn_id;
  }

  public get isLoggedIn(): boolean {
    const isloggedin = !Utils.isNullOrUndefined(this.accessToken) && !Utils.isNullOrUndefined(this.txnId);

    return isloggedin;
  }

  private get loginCreds(): any {
    return JSON.parse(localStorage.getItem('login_creds'));
  }

  private get secretKey(): string {
    const existingSecretKey = this.localStorageService.getFromLocalStorage('secret_key');

    if (Utils.isNullOrUndefined(existingSecretKey)) {
      const scKey = "U2FsdGVkX18BYi2wPdSgIOI4TyVT0kIavMTI8eK/4Qr+eOVTP7N7EcRUaSMJrgv3h9ma1jFdNeE7YiF4fcqgNQ==";
      this.localStorageService.addToLocalStorage('secret_key', scKey);

      return scKey;
    } else {
      return existingSecretKey;
    }
  }
}
