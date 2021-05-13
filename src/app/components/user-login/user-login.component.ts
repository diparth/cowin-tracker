import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { sha256 } from 'js-sha256';
import { Router } from '@angular/router';

@Component({
  selector: 'cw-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {

  public form: FormGroup;
  public mobileFC: FormControl;
  public otpFC: FormControl;

  private txnId: string;

  constructor(private authService: AuthenticateService, private router: Router) { }

  ngOnInit(): void {
    this.mobileFC = new FormControl('');
    this.otpFC = new FormControl('');

    this.form = new FormGroup({
      mobile: this.mobileFC,
      otp: this.otpFC
    });
  }

  public processMobile(): void {
    this.authService.loginWithNumber({ mobile: this.mobileFC.value }).subscribe(result => {
      this.authService.setUpLocalStore({ txn_id: result.txnId });
      this.txnId = result.txnId;
    });
  }

  public processOTP(): void {
    const otp = sha256(this.otpFC.value.toString());

    this.authService.loginWithOTP({ otp, txnId: this.txnId }).subscribe(result => {
      this.authService.setUpLocalStore({ ...result });
      this.router.navigate([ 'dashboard' ]);
    });
  }
}
