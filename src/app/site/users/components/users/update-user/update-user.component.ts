import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { debug } from 'console';
import { error } from 'protractor';
import { ValidateForm } from 'src/app/site/core/helpers/validate-formfields-helper';
import { User } from '../../../models/entitys/user';
import { AddressInsertRequest } from '../../../models/request/addressinsertrequest';
import { AddressUpdateRequest } from '../../../models/request/addressupdaterequest';
import { userUpdateRequest } from '../../../models/request/userupdaterequest';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss'],
})
export class UpdateUserComponent implements OnInit {
  user: User;
  updatedUser : User;
  formSubmitAttempt: boolean;
  hasAddress:boolean=false;
  modAddress:boolean=false;
  concentratedForm: FormGroup;
  userid : number;

  userUpdateRequest: userUpdateRequest;
  addressUpdateRequest : AddressUpdateRequest;
  addressInsertRequest : AddressInsertRequest;
  // addressForm: FormGroup;
  validateForm = ValidateForm;

  constructor(
    private _route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private usersService: UserService
  ) {}

  ngOnInit(): void {
    this._route.queryParams.subscribe((params) => {
      if (params.user) {
        this.user = JSON.parse(params.user) as User;
        this.userid=this.user.userID;
        this.SetValidatorsUser();
      }
    });
  }

  onSubmit() {
      this.updatedUser = this.concentratedForm.value;
      if(this.modAddress)
      {
        if (this.concentratedForm.valid) 
        {
          if (this.hasAddress) 
          {
            this.asignValuetoUserRequest();
            this.asignValuetoAddressUpdateRequest();
            this.usersService.updateUser(this.userUpdateRequest).subscribe(response=>{
              console.log(response);
              this.modAddress=false;
            }),(error=>{
              console.log(error);
            });
            this.usersService.updateAddress(this.addressUpdateRequest).subscribe(response=>{
              console.log(response);
            }),(error=>{
              console.log(error);
            });
          }
          else
          {
            this.asignValuetoUserRequest();
            this.asignValuetoAddressInsertRequest();
            this.usersService.updateUser(this.userUpdateRequest).subscribe(response=>{
              console.log(response);
            }),(error=>{
              console.log(error);
            });
            this.usersService.InsertAddress(this.addressInsertRequest).subscribe(response=>{
              console.log(response);
              this.modAddress=false;
            }),(error=>{
              console.log(error);
            });
          }
          this.concentratedForm.reset();
          this.formSubmitAttempt = true;
        } 
        else 
        {
          this.validateForm.validateAllFormFields(this.concentratedForm);
          this.formSubmitAttempt = false;
        }
      }
      else
      {
        this.SetValidatorsUserNew();
        if (this.concentratedForm.valid)
        {
          console.log('es valido');  
          this.asignValuetoUserRequest();
          this.usersService.updateUser(this.userUpdateRequest).subscribe(response=>{
            console.log(response);
            this.concentratedForm.reset();
          }),(error=>{
            console.log(error);
          });
        }
      }
      this.userUpdateRequest = undefined;
      this.addressUpdateRequest = undefined;
      this.addressInsertRequest = undefined;
  }

  validationInput(field: string): boolean {
    return this.concentratedForm.get(field).errors != undefined;
  }

  SetValidatorsUser() {
    this.concentratedForm = this._formBuilder.group({
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
      country: new FormControl('', [
        Validators.required,Validators.pattern(/^[A-Za-z  , ( )]{4,60}$/),
      ]),
      state: new FormControl('', [Validators.required,Validators.pattern(/^[A-Za-z ]{3,50}$/)]),
      lineAddress1: new FormControl('', [
        Validators.required,Validators.maxLength(80),
        Validators.pattern(/^[A-Za-z0-9  , . ñ ( )]{8,80}$/),
      ]),
      lineAddress2: new FormControl('', [
        Validators.required,Validators.pattern(/^[A-Za-z0-9  . ñ ( ) ,]{0,80}$/),
      ]),
      postalCode: new FormControl('', [Validators.required,Validators.pattern(/^[0-9]{5,5}$/)]),
      city: new FormControl('', [Validators.required,Validators.pattern(/^[A-Za-z ,]{3,45}$/)]),
    });
    this.setEditUser();
    if(this.user.addressID>0)
      this.hasAddress=true;
  }

  SetValidatorsUserNew() {
    this.concentratedForm = this._formBuilder.group({
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
      country: new FormControl('', [
        Validators.pattern(/^[A-Za-z  , ( )]{4,60}$/),
      ]),
      state: new FormControl('', [Validators.pattern(/^[A-Za-z ]{3,50}$/)]),
      lineAddress1: new FormControl('', [
        Validators.maxLength(80),
        Validators.pattern(/^[A-Za-z0-9  , . ñ ( )]{8,80}$/),
      ]),
      lineAddress2: new FormControl('', [
        Validators.pattern(/^[A-Za-z0-9  . ñ ( ) ,]{0,80}$/),
      ]),
      postalCode: new FormControl('', [Validators.pattern(/^[0-9]{5,5}$/)]),
      city: new FormControl('', [Validators.pattern(/^[A-Za-z ,]{3,45}$/)]),
    });
    this.setEditNewParamsUser();

  }

  setEditUser() {
    if (this.concentratedForm && this.user) {
      this.concentratedForm.get('firstName').setValue(this.user.firstName);
      this.concentratedForm.get('lastName').setValue(this.user.lastName);
      this.concentratedForm.get('email').setValue(this.user.email);
      this.concentratedForm.get('phone').setValue(this.user.phone);
      if (this.user.addressID) {
        this.concentratedForm.get('lineAddress1').setValue(this.user.lineAddress1);
        this.concentratedForm.get('lineAddress2').setValue(this.user.lineAddress2);
        this.concentratedForm.get('country').setValue(this.user.country);
        this.concentratedForm.get('state').setValue(this.user.state);
        this.concentratedForm.get('city').setValue(this.user.city);
        this.concentratedForm.get('postalCode').setValue(this.user.postalCode);
      }
    }
  }

  setEditNewParamsUser() {
    if (this.concentratedForm && this.user) {
      this.concentratedForm.get('firstName').setValue(this.updatedUser.firstName);
      this.concentratedForm.get('lastName').setValue(this.updatedUser.lastName);
      this.concentratedForm.get('email').setValue(this.updatedUser.email);
      this.concentratedForm.get('phone').setValue(this.updatedUser.phone);
    }
  }

  setFlagAddress()
  {
    if(this.modAddress)
      this.modAddress=false;
    else
    {
      this.modAddress=true;
    }
  }

  asignValuetoUserRequest()
  {
    this.userUpdateRequest = new userUpdateRequest();
    this.userUpdateRequest.userID=this.userid;
    this.userUpdateRequest.firstName=this.concentratedForm.get('firstName').value;
    this.userUpdateRequest.lastName=this.concentratedForm.get('lastName').value;
    this.userUpdateRequest.email=this.concentratedForm.get('email').value;
    this.userUpdateRequest.phone=this.concentratedForm.get('phone').value;
  }

  asignValuetoAddressInsertRequest()
  {
    this.addressInsertRequest = new AddressInsertRequest();
    this.addressInsertRequest.userID=this.userid;
    this.addressInsertRequest.lineAddress1=this.concentratedForm.get('lineAddress1').value;
    this.addressInsertRequest.lineAddress2=this.concentratedForm.get('lineAddress2').value;
    this.addressInsertRequest.country=this.concentratedForm.get('country').value;
    this.addressInsertRequest.state=this.concentratedForm.get('state').value;
    this.addressInsertRequest.city=this.concentratedForm.get('city').value;
    this.addressInsertRequest.postalCode=this.concentratedForm.get('postalCode').value+"";
  }

  asignValuetoAddressUpdateRequest()
  {
    this.addressUpdateRequest= new AddressUpdateRequest();
    this.addressUpdateRequest.userID=this.userid;
    this.addressUpdateRequest.lineAddress1=this.concentratedForm.get('lineAddress1').value;
    this.addressUpdateRequest.lineAddress2=this.concentratedForm.get('lineAddress2').value;
    this.addressUpdateRequest.country=this.concentratedForm.get('country').value;
    this.addressUpdateRequest.state=this.concentratedForm.get('state').value;
    this.addressUpdateRequest.city=this.concentratedForm.get('city').value;
    this.addressUpdateRequest.postalCode=this.concentratedForm.get('postalCode').value+"";
  }
}
