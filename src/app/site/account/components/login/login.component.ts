import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SecurityHelper } from 'src/app/site/core/helpers/security-helper';
import { ValidateForm } from 'src/app/site/core/helpers/validate-formfields-helper';
import { HelperService } from 'src/app/site/core/services/helper.service';
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

  fieldTextType: boolean=false;

  validateForm = ValidateForm;

  constructor(
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toastr:ToastrService,
    private helperService:HelperService
  ) {

    if(SecurityHelper.getToken()){
      this.router.navigate(['/home/dash']);
      return;
    }

  }

  ngOnInit(): void {
    this.helperService.loadScript(
      '../../../../assets/js/scripts.js'
    ).subscribe(response=>
      {});
    this.SetValidatorsLogin();
  }

  onSubmit() {
    if (this.loginForm.valid) 
    {
      this.activatedButton=false;
      this.formSubmitAttempt = true;
      let userLogin = new UserLogin(
        this.loginForm.get('email').value,
        this.loginForm.get('password').value
      );
      this.userService.Login(userLogin).subscribe(
        (request) => {
          if(request.userID>0)
          {
            SecurityHelper.setTokenStorage(request);
              this.router.navigate(['/home/dash']);
          }
          else
          {
            this.toastr.error('Credenciales incorrectas, intenta de nuevo','Error');
            this.loginForm.get('password').reset();
            this.activatedButton=true;
          }
        });
        this.activatedButton=true;
    } 
    else 
    {
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
        // Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\u00f1\u00d1]{6,50}$/),
      ]),
    });
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  validationInput(field: string): boolean {
    return this.loginForm.get(field).errors != undefined;
  }
}
