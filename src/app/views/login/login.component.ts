import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services';
import { User } from '../../models';
//import { Ng2IzitoastService } from 'ng2-izitoast';//<-- this line
import { freeSet } from '@coreui/icons/js/free';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls:[
    './login.component.scss'
  ]
})
export class LoginComponent implements OnInit {
  icons = freeSet ;

  user: User = new User();

  public formUser: FormGroup = new FormGroup({
    username: new FormControl('',Validators.required),
    password: new FormControl('',Validators.required),
  });

  isBusy: Boolean = false;
  isAuthorized: Boolean | null = null;
  constructor(
    //public iziToast: Ng2IzitoastService,
    private formBuilder: FormBuilder,
    private uS: UserService, private router: Router) {
    localStorage.removeItem('currentUser');
  }

  ngOnInit() {
    this.formUser = this.formBuilder.group(
      {
        username: new FormControl('',Validators.required),
        password: new FormControl('',Validators.required),
      }
    );
    this.isBusy = false;
  }

  get f(): { [key: string]: AbstractControl } {
    return this.formUser.controls;
  }

  login() {
    this.isBusy = true;
    this.user.username = this.formUser.value.username;
    this.user.password = this.formUser.value.password;
    this.uS.login(this.user).subscribe(r => {
      this.isAuthorized = true;
      localStorage.setItem('currentUser', JSON.stringify(r.success));
      this.router.navigate(['/page']);
    }, error => {
      this.isBusy = false;
      this.isAuthorized = false;
      
    });
  }
}
