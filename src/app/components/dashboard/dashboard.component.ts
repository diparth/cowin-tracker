import { Center, Session } from './../../models/center';
import { FormGroup, FormControl } from '@angular/forms';
import { User } from './../../models/user';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserService } from 'src/app/services/user.service';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { CenterService } from 'src/app/services/center.service';
import { DatePipe } from '@angular/common';
import { AppointmentService } from 'src/app/services/appointment.service';

@Component({
  selector: 'cw-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('captcha') captchaElem: ElementRef;

  public users: User[] = [];
  public mobile: string;
  public usersVaccine: string;
  public selectedUsers: User[] = [];
  public beneficiaries: string[] = [];

  public centers: Center[] = [];
  public sessions: Session[] = [];
  public selectedSession: Session;

  public form: FormGroup;
  public pinCode: FormControl;
  public ageLimit: FormControl;
  public dose: FormControl;
  public slot: FormControl;

  public interval: any;
  public trackCount: number = 0;
  public result: string;
  public isAutomating: boolean;
  public hasCaptcha: boolean;

  constructor(
    private userService: UserService,
    private authService: AuthenticateService,
    private centerService: CenterService,
    private datePipe: DatePipe,
    private appointmentService: AppointmentService,
    private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.mobile = this.localStorageService.getFromLocalStorage('mobile');

    this.pinCode = new FormControl();
    this.dose = new FormControl(1);
    this.ageLimit = new FormControl('18');
    this.slot = new FormControl(1);

    this.form = new FormGroup({
      pincode: this.pinCode,
      age: this.ageLimit,
      dose: this.dose,
      slot: this.slot
    });

    this.fetchUsers();
  }

  public fetchUsers(): void {
    this.userService.getBeneficiaries().subscribe(result => {
      this.localStorageService.setupUserLocalStorage(result);
      this.buildUserData(result.beneficiaries);
    }, err => {
      if (err && (err.status == 401 && err.statusText == "Unauthorized")) {
        this.authService.logout();
      }
    });
  }

  public buildUserData(data: any[]) {
    this.users = data.map(item => new User(item));
  }

  public onCheckChange(data: User, event: any): void {
    if (event.target.checked) {
      this.selectedUsers.push(data);
      this.beneficiaries.push(data.beneficiary_reference_id);
    } else {
      const index = this.selectedUsers.findIndex((user: User) => user.beneficiary_reference_id === data.beneficiary_reference_id);
      this.selectedUsers.splice(index, 1);
      this.beneficiaries.splice(index, 1);
    }

    this.usersVaccine = this.selectedUsers.length > 0 ? this.selectedUsers[0].vaccine : '';
  }

  public searchCenters(): void {
    const body = {
      pincode: this.pinCode.value,
      date: this.datePipe.transform(new Date(), 'dd-MM-yyyy'),
      vaccine: this.usersVaccine
    };

    this.centerService.getCentersByCalanderPin(body).subscribe(result => {
      this.centers = result.centers;
      this.sessions = [];
      this.trackCount++;

      this.centers.forEach((center: Center) => {
        center.sessions.forEach((session: Session) => {
          if (session.min_age_limit == this.ageLimit.value) {
            session.name = center.name;
            session.center_id = center.center_id;
            this.sessions.push(session);
            this.selectedSession = session;

            if (session.available_capacity > this.beneficiaries.length) {
              this.loadCaptchaAndDialog();
              this.stopProcess();
            }
          }
        });
      });
    }, err => {
      if (err && (err.status == 401 && err.statusText == "Unauthorized")) {
        this.authService.logout();
      }
    });
  }

  public automateProcess(): void {
    this.isAutomating = true;
    this.interval = setInterval(() => {
      this.searchCenters();
    }, 1500);
  }

  public stopProcess(): void {
    clearInterval(this.interval);
    this.isAutomating = false;
    this.trackCount = 0;
  }

  public loadCaptchaAndDialog(): void {
    this.appointmentService.loadCaptcha().subscribe(result => {
      this.hasCaptcha = true;
      this.captchaElem.nativeElement.innerHTML = result.captcha;

      const successToneElem: HTMLElement | any = document.getElementById('successTone');
      successToneElem.play();
    });
  }

  public submit(): void {
    this.prepareAndSubmitAppointmentData(this.selectedSession);
  }

  public prepareAndSubmitAppointmentData(session: Session): void {
    let myCaptcha: HTMLElement | any = document.getElementById('captcha');;
    if (myCaptcha.value == '') {
      myCaptcha.focus();

      return;
    }

    const body = {
      center_id: session.center_id,
      dose: Number(this.dose.value),
      session_id: session.session_id,
      slot: session.slots[ this.slot.value ],
      captcha: myCaptcha.value,
      beneficiaries: this.beneficiaries
    }

    this.appointmentService.submitForAppointment(body).subscribe(result => {
      window.alert(result.appointment_confirmation_no);
      this.result = `Appointment Ref. No: ${result.appointment_confirmation_no}`;

    }, err => {
      console.log(err);
    });
  }
}
