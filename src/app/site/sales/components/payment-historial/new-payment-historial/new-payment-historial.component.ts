import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ValidateForm } from 'src/app/site/core/helpers/validate-formfields-helper';
import { PendingPaymentInfo } from '../../../models/entitys/pendingpaymentinfo';
import { InsertPaymentHistorialRequest } from '../../../models/request/insertpaymenthistorialrequest';
import { SalesService } from '../../../services/sales.service';

@Component({
  selector: 'app-new-payment-historial',
  templateUrl: './new-payment-historial.component.html',
  styleUrls: ['./new-payment-historial.component.scss']
})
export class NewPaymentHistorialComponent implements OnInit {
  @Input() pendingPayment:PendingPaymentInfo; 

  constructor(public modal: NgbActiveModal,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private saleService : SalesService) {}

  paymentForm : FormGroup;

  dev:number=0;
  cancelPending=false;
  total:number;

  validateForm = ValidateForm;

  ngOnInit(): void {
    this.SetValidatorPay();
    this.total=parseFloat((this.pendingPayment.indeb-this.pendingPayment.payed).toFixed(2));
  }

  async onSubmit()
  {
    if(this.paymentForm.valid)
    {
      let amount = this.paymentForm.get('amount').value;
      if(amount>=this.total)
      {
        this.cancelPending=true;
        amount=this.total;
      }
      let request : InsertPaymentHistorialRequest;
      request = new InsertPaymentHistorialRequest;
      request.amount=amount;
      request.pendingID=this.pendingPayment.pendingID;
      request.paymentMethodID=2;
      var response = await this.saleService.newPayHistorial(request).toPromise();
      if(response>0)
      {
        if(this.cancelPending)
        {
          this.pendingPayment.statusPay=false;
        }
        this.pendingPayment.payed=parseFloat((this.pendingPayment.payed+amount).toFixed(2));
        this.toastr.success('Pago realizado correctamente','Correcto');
        this.modal.close();
      }
      else
      {
        this.toastr.error('No se pudo completar la transacción','error');
      }
    }
  }

  calc()
  {
    let amount=this.paymentForm.get('amount').value;
    if(this.total<amount)
    {
      this.dev=parseFloat((amount-this.total).toFixed(2));
    }
    else
    {
      this.dev=0;
    }
  }

  SetValidatorPay() {
    this.paymentForm = this._formBuilder.group({
      amount: new FormControl('', [
        Validators.required,Validators.min(1)
      ])
    });
  }

  validationInput(field: string): boolean {
    return this.paymentForm.get(field).errors != undefined;
  }
}
