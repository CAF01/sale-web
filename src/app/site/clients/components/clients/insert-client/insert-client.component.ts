import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RedirectHelper } from 'src/app/site/core/helpers/redirect-helper';
import { ValidateForm } from 'src/app/site/core/helpers/validate-formfields-helper';
import * as Feather from 'feather-icons';
import { insertClientRequest } from '../../../models/request/insertclientrequest';
import { insertAddressClientRequest } from '../../../models/request/insertaddressclientrequest';
import { SubstringHelper } from 'src/app/site/core/helpers/substring-helper';
import { ClientService } from '../../../services/client.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-insert-client',
  templateUrl: './insert-client.component.html',
  styleUrls: ['./insert-client.component.scss']
})
export class InsertClientComponent implements OnInit {
  
  formSubmitAttempt: boolean;
  clientForm: FormGroup;
  addressForm: FormGroup;

  client : insertClientRequest;
  address : insertAddressClientRequest;

  redirectHelper = RedirectHelper;
  validateForm = ValidateForm;
  telephone: string;
  workphone:string;
  flag?: boolean;
  flagAddressSkipped: boolean;
  addressSubmited: boolean;
  list:boolean=false;
  validatePhone=0;

  constructor(private _formBuilder: FormBuilder,private clientService : ClientService, private toastr : ToastrService,
    private router: Router) { }


  ngOnInit(): void {
    Feather.replace();
    this.SetValidatorsClient();
    this.SetValidatorsAddress();
    this.setTrueFlags();
    if(sessionStorage.listProducts)
    {
      this.list=true;
    }
  }

  async findIfExistsPhone(phone:string)
  { 
    this.validatePhone = await this.clientService.findIfExistsPhone(phone).toPromise();
  }

  return()
  {
    this.router.navigate(['home/sales/new-sale-beta']);
  }


  onSubmit(numbForm:number)
  {
    if(numbForm==1)
    {
      if(this.clientForm.valid)
      {
        this.findIfExistsPhone(this.clientForm.get('phone').value);
        if(this.validatePhone>0)
        {
          this.toastr.error('El teléfono ya se ha registrado anteriormente','Error');
          this.flag=false;
          this.clientForm.get('phone').reset();
        }
        else
        {
          this.client=this.clientForm.value;
          this.telephone= SubstringHelper.CutString(this.client.phone);
          if(this.client.workPhone!="")
          {
            this.workphone=SubstringHelper.CutString(this.client.workPhone);
          }
          this.formSubmitAttempt=true;
          this.flag = true;
          this.Redirect('#wizard2');
        }
      }
      else
      {
        this.validateForm.validateAllFormFields(this.clientForm);
        this.formSubmitAttempt=false;
      }
    }
    if(numbForm==2)
    {
      if (this.addressForm.valid) 
      {
        this.address = this.addressForm.value;
        this.convertClientToClientAddress();
        this.addressSubmited=true;
        this.Redirect('#wizard4');
      } 
      else 
      {
        this.validateForm.validateAllFormFields(this.addressForm);
        this.addressSubmited=false;
      }
    }

  }

  async InsertClient()
  {
    if (this.address==undefined && this.flagAddressSkipped && this.client) 
    {
      let result = await this.clientService.newClient(this.client).toPromise();
      if(result>0)
      {
        this.toastr.success('Cliente agregado correctamente','Correcto');
          if(sessionStorage.listProducts)
          {
            sessionStorage.setItem('clientInfo', JSON.stringify(this.client));
            sessionStorage.setItem('clientID',result.toString());
            this.router.navigate(['home/sales/new-sale']);
          }
          this.reset();
          this.Redirect("#wizard1");
      }
    }
    if(this.address && this.addressSubmited && this.formSubmitAttempt)
    {
      let result = await this.clientService.newClientWithAddress(this.client).toPromise();
      if(result>0)
      {
        this.toastr.success('Cliente agregado correctamente','Correcto');
        if(sessionStorage.listProducts)
        {
            sessionStorage.setItem('clientInfo', JSON.stringify(this.client));
            sessionStorage.setItem('clientID',result.toString());
            this.router.navigate(['home/sales/new-sale']);
        }
        this.reset();
        this.Redirect("#wizard1");
      }
    }
  }

  Skip() {
    this.flagAddressSkipped = true;
    this.address = undefined;
    this.addressForm.reset();
    this.Redirect('#wizard4');
  }

  validationInput(field: string): boolean {
    return this.clientForm.get(field).errors != undefined;
  }

  validationInputAddress(field: string): boolean {
    return this.addressForm.get(field).errors != undefined;
  }

  SetValidatorsClient() {
    this.clientForm = this._formBuilder.group({
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(45),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
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
      workPhone: new FormControl('', [
        Validators.pattern(/^[0-9]{10,10}$/)
      ]),
      notes: new FormControl('',[]),
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

  Redirect(focus) {
    this.redirectHelper.NextTab('#cardTab', focus);
  }

  setTrueFlags() {
    this.addressSubmited=true;
    this.formSubmitAttempt = true;
  }

  reset() {
      this.clientForm.reset();
      this.addressForm.reset();
      this.formSubmitAttempt = true;
      this.flag = false;
      this.client = undefined;
      this.telephone="";
      this.workphone="";
      this.addressSubmited=true;
  }

   convertClientToClientAddress()
  {
    this.client.country=this.address.country;
    this.client.state=this.address.state;
    this.client.city=this.address.city;
    this.client.lineAddress1=this.address.lineAddress1;
    this.client.lineAddress2=this.address.lineAddress2;
    this.client.postalCode=this.address.postalCode.toString();
  }
}
