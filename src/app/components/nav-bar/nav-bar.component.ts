import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from 'src/app/services/authenticate.service';

@Component({
  selector: 'cw-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  constructor(private authService: AuthenticateService, private router: Router) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn) {
      this.router.navigate([ 'login' ]);
    }
  }

  public logout(): void {
    this.authService.logout();
  }
}
