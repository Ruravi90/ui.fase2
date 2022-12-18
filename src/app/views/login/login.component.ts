import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services';
import { User } from '../../models';
import { freeSet } from '@coreui/icons/js/free';
import izitoast from 'izitoast';

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
    private formBuilder: FormBuilder,
    private uS: UserService,
    private router: Router) {
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

  login(){
    if( this.isBusy)
      return;

    this.isBusy = true;
    this.user.username = this.formUser.value.username;
    this.user.password = this.formUser.value.password;

    this.uS.login(this.user).subscribe(
    {
      next: (r:any)=>{
        this.isAuthorized = true;
        localStorage.setItem('currentUser', JSON.stringify(r));
        this.router.navigate(['/page']);
      },
      error: ()=>{
        izitoast.error({
          theme: 'dark',
          title: 'Usuario o Contraseña incorrectas'
        });
        this.isBusy = false;
        this.isAuthorized = false;
      }
    });
  }
}
