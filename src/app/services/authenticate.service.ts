import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../helpers/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  constructor(private http: HttpClient) { }

  public loginWithNumber(body: any): Observable<any> {

    return this.http.post(`${API_URL}/v2/auth/generateOTP`, body);
  }
}
