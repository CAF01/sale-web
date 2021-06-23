import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidateForm } from 'src/app/site/core/helpers/validate-formfields-helper';
import { client } from '../../../models/entitys/client';
import { insertAddressClientRequest } from '../../../models/request/insertaddressclientrequest';
import { updateAddressClientRequest } from '../../../models/request/updateaddressclientrequest';
import { updateClientRequest } from '../../../models/request/updateclientrequest';
import { ClientService } from '../../../services/client.service';
import * as Feather from 'feather-icons';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-client',
  templateUrl: './update-client.component.html',
  styleUrls: ['./update-client.component.scss']
})
export class UpdateClientComponent implements OnInit {

  client: client;
  updatedUser : client;
  formSubmitAttempt: boolean;
  hasAddress:boolean=false;
  modAddress:boolean=false;
  concentratedForm: FormGroup;
  clientID : number;
  bothCorrect:boolean=false;

  clientUpdateRequest: updateClientRequest;
  addressUpdateRequest : updateAddressClientRequest;
  addressInsertRequest : insertAddressClientRequest;
  // addressForm: FormGroup;
  validateForm = ValidateForm;

  constructor(
    private _route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private clientService: ClientService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    Feather.replace();
    this._route.queryParams.subscribe((params) => {
      if (params.client) {
        this.client = JSON.parse(params.client) as client;
        this.clientID=this.client.clientID;
        this.SetValidatorsUser();
      }
    });
  }

  finalize()
  {
    this.toastr.success('Datos de cliente actualizados correctamente','Correcto!');
    this.router.navigate(['home/clients/list']);
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
            this.clientService.updateClient(this.clientUpdateRequest).subscribe(response=>{
              this.modAddress=false;
              this.bothCorrect=true;
            },(error=>{
              console.log(error);
              this.bothCorrect=false;
            }));
            this.clientService.updateAddress(this.addressUpdateRequest).subscribe(response=>{
              if(this.bothCorrect)
              {
                this.finalize();
              }
            },
            (error=>{
              console.log(error);
              this.bothCorrect=false;
            }));
          }
          else
          {
            this.asignValuetoUserRequest();
            this.asignValuetoAddressInsertRequest();
            this.clientService.updateClient(this.clientUpdateRequest).subscribe(response=>{
              this.bothCorrect=true;
            },(error=>{
              console.log(error);
              this.bothCorrect=false;
            }));
            this.clientService.InsertAddress(this.addressInsertRequest).subscribe(response=>{
              if(this.bothCorrect)
              {
                this.finalize();
              }
              this.modAddress=false;
            },(error=>{
              console.log(error);
              this.bothCorrect=false;
            }));
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
          this.asignValuetoUserRequest();
          this.clientService.updateClient(this.clientUpdateRequest).subscribe(response=>{
            this.concentratedForm.reset();
            this.finalize();
          },
          (error=>{
            console.log(error);
          }));
        }
      }
      this.clientUpdateRequest = undefined;
      this.addressUpdateRequest = undefined;
      this.addressInsertRequest = undefined;
  }

  validationInput(field: string): boolean {
    return this.concentratedForm.get(field).errors != undefined;
  }

  back()
  {
    this.router.navigate(['home/clients/list']);
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
      workPhone: new FormControl('', [
        Validators.pattern(/^[0-9]{10,10}$/)
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
      notes: new FormControl('',[]),
    });
    this.setEditUser();
    if(this.client.addressID>0)
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
      workPhone: new FormControl('', [
        Validators.pattern(/^[0-9]{10,10}$/)
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
      notes: new FormControl('',[]),
    });
    this.setEditNewParamsUser();

  }

  setEditUser() {
    if (this.concentratedForm && this.client) {
      this.concentratedForm.get('firstName').setValue(this.client.firstName);
      this.concentratedForm.get('lastName').setValue(this.client.lastName);
      this.concentratedForm.get('email').setValue(this.client.email);
      this.concentratedForm.get('phone').setValue(this.client.phone);
      this.concentratedForm.get('notes').setValue(this.client.notes);
      this.concentratedForm.get('workPhone').setValue(this.client.workPhone);
      if (this.client.addressID) {
        this.concentratedForm.get('lineAddress1').setValue(this.client.lineAddress1);
        this.concentratedForm.get('lineAddress2').setValue(this.client.lineAddress2);
        this.concentratedForm.get('country').setValue(this.client.country);
        this.concentratedForm.get('state').setValue(this.client.state);
        this.concentratedForm.get('city').setValue(this.client.city);
        this.concentratedForm.get('postalCode').setValue(this.client.postalCode);
      }
    }
  }

  setEditNewParamsUser() {
    if (this.concentratedForm && this.client) {
      this.concentratedForm.get('firstName').setValue(this.updatedUser.firstName);
      this.concentratedForm.get('lastName').setValue(this.updatedUser.lastName);
      this.concentratedForm.get('email').setValue(this.updatedUser.email);
      this.concentratedForm.get('phone').setValue(this.updatedUser.phone);
      this.concentratedForm.get('notes').setValue(this.updatedUser.notes);
      this.concentratedForm.get('workPhone').setValue(this.updatedUser.workPhone);
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
    this.clientUpdateRequest = new updateClientRequest();
    this.clientUpdateRequest.clientID=this.clientID;
    this.clientUpdateRequest.firstName=this.concentratedForm.get('firstName').value;
    this.clientUpdateRequest.lastName=this.concentratedForm.get('lastName').value;
    this.clientUpdateRequest.email=this.concentratedForm.get('email').value;
    this.clientUpdateRequest.phone=this.concentratedForm.get('phone').value;
    this.clientUpdateRequest.notes=this.concentratedForm.get('notes').value;
    this.clientUpdateRequest.workPhone=this.concentratedForm.get('workPhone').value;
  }

  asignValuetoAddressInsertRequest()
  {
    this.addressInsertRequest = new insertAddressClientRequest();
    this.addressInsertRequest.clientID=this.clientID;
    this.addressInsertRequest.lineAddress1=this.concentratedForm.get('lineAddress1').value;
    this.addressInsertRequest.lineAddress2=this.concentratedForm.get('lineAddress2').value;
    this.addressInsertRequest.country=this.concentratedForm.get('country').value;
    this.addressInsertRequest.state=this.concentratedForm.get('state').value;
    this.addressInsertRequest.city=this.concentratedForm.get('city').value;
    this.addressInsertRequest.postalCode=this.concentratedForm.get('postalCode').value+"";
  }

  asignValuetoAddressUpdateRequest()
  {
    this.addressUpdateRequest= new updateAddressClientRequest();
    this.addressUpdateRequest.clientID=this.clientID;
    this.addressUpdateRequest.lineAddress1=this.concentratedForm.get('lineAddress1').value;
    this.addressUpdateRequest.lineAddress2=this.concentratedForm.get('lineAddress2').value;
    this.addressUpdateRequest.country=this.concentratedForm.get('country').value;
    this.addressUpdateRequest.state=this.concentratedForm.get('state').value;
    this.addressUpdateRequest.city=this.concentratedForm.get('city').value;
    this.addressUpdateRequest.postalCode=this.concentratedForm.get('postalCode').value+"";
  }
}