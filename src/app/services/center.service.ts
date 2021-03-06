import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../helpers/constants';
import { Utils } from '../helpers/utils';
import { AuthenticateService } from './authenticate.service';

@Injectable({
  providedIn: 'root'
})
export class CenterService {

  constructor(private http: HttpClient, private authService: AuthenticateService) { }

  public getCentersByCalanderPin(body: any): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': this.authService.accessToken });

    if (!Utils.isNullOrUndefined(body.vaccine) && body.vaccine !== '') {
      return this.http.get(`${API_BASE_URL}/api/v2/appointment/sessions/calendarByPin?pincode=${body.pincode}&date=${body.date}&vaccine=${body.vaccine}`, { headers });
    }

    // Date format: DD-MM-YYYY
    return this.http.get(`${API_BASE_URL}/api/v2/appointment/sessions/calendarByPin?pincode=${body.pincode}&date=${body.date}`, { headers });
  }
}
