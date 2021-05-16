import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  public downloadAppointmentSlip(appId: string): Observable<any> {
    const url = `${API_BASE_URL}/api/v2/appointment/appointmentslip/download?appointment_id=${appId}`;
    const headers = new HttpHeaders({
      'Authorization': this.authService.accessToken,
      'Accept': 'application/pdf, text/plain, */*'
    });

    return this.http.get(url, { headers, responseType: 'arraybuffer' }).pipe(map((res: any) => {
      return new Blob([new Uint8Array(res)], { type: 'application/pdf' });
    }));
  }
}
