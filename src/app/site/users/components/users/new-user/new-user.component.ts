import { Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RedirectHelper } from 'src/app/site/core/helpers/redirect-helper';
import { SubstringHelper } from 'src/app/site/core/helpers/substring-helper';
import { ValidateForm } from 'src/app/site/core/helpers/validate-formfields-helper';
import { AddressInsertRequest } from '../../../models/request/addressinsertrequest';
import { userInsertRequest } from '../../../models/request/userinsertrequest';
import { UserService } from '../../../services/user.service';
import * as Feather from 'feather-icons';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss'],
})
export class NewUserComponent implements OnInit {
  telephone:string;
  formSubmitAttempt: boolean;
  flag?: boolean;
  flagAddressSkipped?: boolean;
  addressSubmited?: boolean;
  formAddressSubmitIsValid: boolean;

  userForm: FormGroup;
  addressForm: FormGroup;

  user: userInsertRequest;
  userAddress: AddressInsertRequest;

  redirectHelper = RedirectHelper;
  validateForm = ValidateForm;
  constructor(private _formBuilder: FormBuilder,private usersService: UserService,private toastr: ToastrService) {}

  ngOnInit(): void {
    Feather.replace();
    this.SetValidatorsUser();
    this.SetValidatorsAddress();
    this.setTrueFlags();
  }

  setTrueFlags() {
    this.formSubmitAttempt = true;
    this.formAddressSubmitIsValid = true;
  }

  validationInput(field: string): boolean {
    return this.userForm.get(field).errors != undefined;
  }

  validationInputAddress(field: string): boolean {
    return this.addressForm.get(field).errors != undefined;
  }

  onSubmit(NumberForm: number) {
    if (NumberForm == 1) {
      if (this.userForm.valid) {
        this.user = this.userForm.value;
        this.flag = true;
        this.telephone= SubstringHelper.CutString(this.user.phone);
        this.formSubmitAttempt = true;
        this.Redirect('#wizard2');
      } else {
        this.validateForm.validateAllFormFields(this.userForm);
        this.formSubmitAttempt = false;
      }
    }
    if (NumberForm == 2) {
      if (this.addressForm.valid) {
        this.userAddress = this.addressForm.value;
        this.formAddressSubmitIsValid = true;
        this.addressSubmited = true;
        this.convertUsertoUserAddress();
        this.Redirect('#wizard4');
      } else {
        this.validateForm.validateAllFormFields(this.addressForm);
        this.formAddressSubmitIsValid = false;
      }
    }
  }

  async InsertUser()
  {
    if (this.userAddress==undefined && !this.addressSubmited) 
    {
      let response = await this.usersService.newUser(this.user).toPromise();
      if(response>0)
      {
        this.reset(1);
        this.Redirect("#wizard1");
        this.toastr.success('Muy bien!', 'Nuevo usuario agregado!');
      }
    }
    if(this.userAddress!=undefined && this.addressSubmited && this.formSubmitAttempt && this.flag)
    {
      let response = await this.usersService.newUserWithAddress(this.user).toPromise();
      if(response>0)
      {
        this.reset(2);
        this.reset(1);
        this.Redirect("#wizard1");
        this.toastr.success('Muy bien!', 'Nuevo usuario agregado!');
      }
    }
  }

  Skip() {
    this.flagAddressSkipped = true;
    this.userAddress = undefined;
    this.addressForm.reset();
    this.addressSubmited = false;
    this.Redirect('#wizard4');
  }

  Redirect(focus) {
    this.redirectHelper.NextTab('#cardTab', focus);
  }

  convertUsertoUserAddress()
  {
    this.user.country=this.userAddress.country;
    this.user.state=this.userAddress.state;
    this.user.city=this.userAddress.city;
    this.user.lineAddress1=this.userAddress.lineAddress1;
    this.user.lineAddress2=this.userAddress.lineAddress2;
    this.user.postalCode=this.userAddress.postalCode.toString();
  }

  reset(NumberForm: number) {
    if (NumberForm == 1) {
      this.userForm.reset();
      this.formSubmitAttempt = true;
      this.flag = false;
      this.user = undefined;
      this.telephone="";
    }
    if (NumberForm == 2) {
      this.addressForm.reset();
      this.formAddressSubmitIsValid = true;
    }
  }

  SetValidatorsUser() {
    this.userForm = this._formBuilder.group({
      firstName: new FormControl('', [
        Validators.required,
        Validators.maxLength(45),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.maxLength(45),
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]{10,10}$/),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(100),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\u00f1\u00d1]{6,50}$/),
      ]),
    });
  }

  SetValidatorsAddress() {
    this.addressForm = new FormGroup({
      country: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[A-Za-z  , ( )]{4,60}$/),
      ]),
      state: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[A-Za-z ]{3,50}$/),
      ]),
      lineAddress1: new FormControl('', [
        Validators.required,
        Validators.maxLength(80),
        Validators.pattern(/^[A-Za-z0-9  , . ñ ( )]{8,80}$/),
      ]),
      lineAddress2: new FormControl('', [
        Validators.maxLength(80),
        Validators.pattern(/^[A-Za-z0-9  . ñ ( ) ,]{0,80}$/),
      ]),
      postalCode: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]{5,5}$/),
      ]),
      city: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[A-Za-z ,]{3,45}$/),
      ]),
    });
  }
  
}
