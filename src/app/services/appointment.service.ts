import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../helpers/constants';
import { AuthenticateService } from './authenticate.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private http: HttpClient, private authService: AuthenticateService) { }

  public submitForAppointment(body: any): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': this.authService.accessToken });

    return this.http.post(`${API_BASE_URL}/api/v2/appointment/schedule`, body, { headers })
  }

  public loadCaptcha(): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': this.authService.accessToken });

    return this.http.post(`${API_BASE_URL}/api/v2/auth/getRecaptcha`, {}, { headers });
  }
}
