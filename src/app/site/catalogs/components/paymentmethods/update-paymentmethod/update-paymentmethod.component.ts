import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ValidateForm } from 'src/app/site/core/helpers/validate-formfields-helper';
import { PaymentMethodInfo } from '../../../models/entitys/paymentmethodinfo';
import { paymentUpdateRequest } from '../../../models/request/paymentupdaterequest';
import { CatalogService } from '../../../services/catalog.service';

@Component({
  selector: 'app-update-paymentmethod',
  templateUrl: './update-paymentmethod.component.html',
  styleUrls: ['./update-paymentmethod.component.scss']
})
export class UpdatePaymentmethodComponent implements OnInit {
  @Input() title:string;
  @Input() message?:string;
  @Input() payment : PaymentMethodInfo;


  constructor(public modal: NgbActiveModal,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private catalogService : CatalogService) {}

  paymentForm : FormGroup;

  formSubmitAttempt : boolean=true;
  updatePayment:paymentUpdateRequest;

  validateForm = ValidateForm;

  ngOnInit(): void {
    this.SetValidatorPayment();
  }

  SaveChanges()
  {
    if(this.paymentForm.valid)
    {
      this.updatePayment=this.paymentForm.value;
      this.updatePayment.paymentMethodID=this.payment.paymentMethodID;
      this.catalogService.updatePayment(this.updatePayment).subscribe(request=>
        {
          this.payment.description=this.updatePayment.description;
          this.toastr.success('Método de pago actualizado','¡Correcto!');
          this.modal.close(true);
        },
        error=>
        {
          console.log(error);
        })
      
    }
    else
    {
      this.validateForm.validateAllFormFields(this.paymentForm);
      this.formSubmitAttempt=false;
    }
    
  }

  SetValidatorPayment() {
    this.paymentForm = this._formBuilder.group({
      description: new FormControl('', [
        Validators.required,
        Validators.maxLength(25),
      ])
    });

    this.paymentForm.get('description').setValue(this.payment.description);
  }

  validationInput(field: string): boolean {
    return this.paymentForm.get(field).errors != undefined;
  }
}
