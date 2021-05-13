import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Utils } from 'src/app/helpers/utils';

@Component({
  selector: 'cw-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  public counter: string = undefined;
  public interval: any;

  constructor(private authService: AuthenticateService, private router: Router, private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['login']);
    }

    const lgTime = this.localStorageService.getFromLocalStorage('logout_time');
    if (!Utils.isNullOrUndefined(lgTime)) {
      this.counter = lgTime;
    }

    this.authService.logoutCounter && this.authService.logoutCounter.subscribe(result => {
      if (result === 0) {
        this.counter = undefined;

        return;
      }

      if (result) {
        const dt = new Date(result + 900000);
        this.counter = dt.toLocaleTimeString();
        this.localStorageService.addToLocalStorage('logout_time', this.counter.toString());
      }
    });
  }

  public logout(): void {
    this.authService.logout();
  }
}
