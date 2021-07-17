import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProviderInfo } from '../../../models/entitys/provider';
import { updateProviderRequest } from '../../../models/request/updateproviderrequest';
import { ProviderService } from '../../../services/provider.service';
import * as Feather from 'feather-icons';

@Component({
  selector: 'app-update-provider',
  templateUrl: './update-provider.component.html',
  styleUrls: ['./update-provider.component.scss']
})
export class UpdateProviderComponent implements OnInit {
  provider: ProviderInfo;
  providerForm: FormGroup;
  providerID :number;

  updateProviderRequest : updateProviderRequest;
  constructor(
    private _route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private providerService: ProviderService
  ) { }

  ngOnInit(): void {
    Feather.replace();
    this._route.queryParams.subscribe((params) => {
      if (params.provider) {
        this.provider =JSON.parse(params.provider) as ProviderInfo;
        this.providerID=this.provider.providerID;
        this.SetValidatorCompany();
      }
    });
  }

  onSubmit()
  {
    if(this.providerForm.valid)
    {
      this.asignNewValues();
      this.providerService.updateProvider(this.updateProviderRequest).subscribe(request=>{
        if(request)
        {
          console.log(request);
          //redirect
        }
      },(error=>
        {
          console.log(error);
        }))
    }
  }



  SetValidatorCompany() {
    this.providerForm = this._formBuilder.group({
      companyName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]),
      RFC: new FormControl('', [
        Validators.pattern(/^[A-Z 0-9]{12,13}$/)
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
      contactName: new FormControl('', [
        Validators.required
      ]),
      notes: new FormControl('',[])
    });
    this.SetReceiveValues();
  }

  asignNewValues()
  {
    this.updateProviderRequest = new updateProviderRequest;
    this.updateProviderRequest.companyName=this.providerForm.get('companyName').value;
    this.updateProviderRequest.RFC=this.providerForm.get('RFC').value;
    this.updateProviderRequest.phone=this.providerForm.get('phone').value;
    this.updateProviderRequest.email=this.providerForm.get('email').value;
    this.updateProviderRequest.contactName=this.providerForm.get('contactName').value;
    this.updateProviderRequest.notes=this.providerForm.get('notes').value;
    this.updateProviderRequest.providerID=this.providerID;

  }

  SetReceiveValues()
  {
    this.providerForm.get('companyName').setValue(this.provider?.companyName);
    this.providerForm.get('RFC').setValue(this.provider?.rfc);
    this.providerForm.get('phone').setValue(this.provider?.phone);
    this.providerForm.get('email').setValue(this.provider?.email);
    this.providerForm.get('contactName').setValue(this.provider?.contactName);
    this.providerForm.get('notes').setValue(this.provider?.notes);
  }

  validationInput(field: string): boolean {
    return this.providerForm.get(field).errors != undefined;
  }

}

