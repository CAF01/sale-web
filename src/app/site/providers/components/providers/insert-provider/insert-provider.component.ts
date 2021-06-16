import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RedirectHelper } from 'src/app/site/core/helpers/redirect-helper';
import { SubstringHelper } from 'src/app/site/core/helpers/substring-helper';
import { ValidateForm } from 'src/app/site/core/helpers/validate-formfields-helper';
import { insertProviderRequest } from '../../../models/request/insertproviderrequest';
import { ProviderService } from '../../../services/provider.service';

@Component({
  selector: 'app-insert-provider',
  templateUrl: './insert-provider.component.html',
  styleUrls: ['./insert-provider.component.scss']
})
export class InsertProviderComponent implements OnInit {

  providerForm: FormGroup;

  redirectHelper = RedirectHelper;
  validateForm = ValidateForm;
  formSubmitAttempt: boolean;
  correctSubmit:boolean=false;
  telephone: string;
  company: insertProviderRequest;


  constructor(private _formBuilder: FormBuilder, private providerService : ProviderService,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.formSubmitAttempt=true;
    this.SetValidatorCompany();
  }


  validationInput(field: string): boolean {
    return this.providerForm.get(field).errors != undefined;
  }


  onSubmit() {
      if (this.providerForm.valid) {
        this.company = this.providerForm.value;
        this.telephone= SubstringHelper.CutString(this.company.phone);
        this.formSubmitAttempt = true;
        this.correctSubmit=true;
        this.Redirect('#wizard4');
      } else {
        this.validateForm.validateAllFormFields(this.providerForm);
        this.formSubmitAttempt = false;
      }
  }

  addProvider()
  {
    if(this.company)
    {
      this.providerService.newUser(this.company).subscribe(response=>{
        this.reset();
        this.toastr.toastrConfig.tapToDismiss;
        this.toastr.toastrConfig.autoDismiss=true;
        this.toastr.toastrConfig.closeButton=true;
        this.toastr.toastrConfig.preventDuplicates=false;
        this.toastr.toastrConfig.disableTimeOut=false;
        this.toastr.success('Proveedor agregado correctamente.', 'Correcto');
        this.Redirect('#wizard1');
      },error=>{
        console.log(error);
      });
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
  }

  Redirect(focus) {
    this.redirectHelper.NextTab('#cardTab', focus);
  }

  back()
  {
    this.toastr.toastrConfig.tapToDismiss;
    this.toastr.toastrConfig.autoDismiss=false;
    this.toastr.toastrConfig.closeButton=true;
    this.toastr.toastrConfig.disableTimeOut=true;
    this.toastr.info('Si haces cambios en la información es necesario volver a dar siguiente, así podras ver la información reflejada', 'Información');
    this.Redirect('#wizard1');
  }

  reset() {
      this.providerForm.reset();
      this.formSubmitAttempt = true;
      this.company = undefined;
      this.telephone="";
      this.correctSubmit=false;
  }
}
