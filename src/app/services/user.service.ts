import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticateService } from './authenticate.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private authService: AuthenticateService) { }

  public getBeneficiaries(): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': this.authService.accessToken });

    return this.http.get(`/api/v2/appointment/beneficiaries`, { headers });
  }
}
