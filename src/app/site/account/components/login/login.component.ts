import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SecurityHelper } from 'src/app/site/core/helpers/security-helper';
import { ValidateForm } from 'src/app/site/core/helpers/validate-formfields-helper';
import { UserLogin } from 'src/app/site/users/models/request/user-login';
import { UserService } from 'src/app/site/users/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  formSubmitAttempt: boolean = true;

  loginForm: FormGroup;
  activatedButton:boolean=true;

  validateForm = ValidateForm;

  constructor(
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {

    if(SecurityHelper.getToken()){
      this.router.navigate(['/home/dash']);
      return;
    }

  }

  ngOnInit(): void {
    this.SetValidatorsLogin();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.activatedButton=false;
      this.formSubmitAttempt = true;
      let userLogin = new UserLogin(
        this.loginForm.get('email').value,
        this.loginForm.get('password').value
      );
      this.userService.Login(userLogin).subscribe(
        (request) => {
          SecurityHelper.setTokenStorage(request);
          this.router.navigate(['/home/dash']);
        },error=>
        {
          this.activatedButton=true;
        }
      );
    } else {
      this.formSubmitAttempt = false;
      this.validateForm.validateAllFormFields(this.loginForm);
    }
  }

  SetValidatorsLogin() {
    this.loginForm = this._formBuilder.group({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(100),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,50}$/),
      ]),
    });
  }

  validationInput(field: string): boolean {
    return this.loginForm.get(field).errors != undefined;
  }
}
