import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'cw-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private userService: UserService, private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.userService.getBeneficiaries().subscribe(result => {
      this.localStorageService.setupUserLocalStorage(result);
    });
  }

}
