import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticateService } from './authenticate.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private http: HttpClient, private authService: AuthenticateService) { }

  public submitForAppointment(body: any): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': this.authService.accessToken });

    return this.http.post(`/api/v2/appointment/schedule`, body, { headers })
  }
}