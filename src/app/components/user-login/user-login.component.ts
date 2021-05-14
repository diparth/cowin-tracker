import { LocalStorageService } from './../../services/local-storage.service';
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

  public otpSent: boolean;
  public otpError: boolean;
  public otpExpiry: number = 180;
  public expiryInterval: any;

  private txnId: string;

  constructor(private authService: AuthenticateService, private router: Router, private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.mobileFC = new FormControl('');
    this.otpFC = new FormControl('');

    this.form = new FormGroup({
      mobile: this.mobileFC,
      otp: this.otpFC
    });
  }

  public processMobile(): void {
    if (this.mobileFC.value == '') {
      const el: HTMLElement = document.getElementById('mobile');
      el.focus();

      return;
    }

    this.localStorageService.addToLocalStorage('mobile', this.mobileFC.value);
    this.otpSent = false;

    this.authService.loginWithNumber({ mobile: this.mobileFC.value }).subscribe(result => {
      this.authService.setUpLocalStore({ txn_id: result.txnId });
      this.txnId = result.txnId;
      this.otpSent = true;

      this.startOtpExpiry();
    });
  }

  public startOtpExpiry(): void {
    this.expiryInterval = setInterval(() => {
      this.otpExpiry--;

      if (this.otpExpiry == 0) {
        this.otpExpiry = 180;
        clearInterval(this.expiryInterval);
      }
    }, 1000);
  }

  public processOTP(): void {
    if (this.mobileFC.value == '') {
      const el: HTMLElement = document.getElementById('otp');
      el.focus();

      return;
    }

    const otp = sha256(this.otpFC.value.toString());

    this.authService.loginWithOTP({ otp, txnId: this.txnId }).subscribe(result => {
      this.authService.setUpLocalStore({ ...result });
      this.router.navigate([ 'dashboard' ]);
    }, err => {
      this.otpError = true;
      console.log(err);
    });
  }
}
