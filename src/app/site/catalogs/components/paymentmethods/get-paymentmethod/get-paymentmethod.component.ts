import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ValidateForm } from 'src/app/site/core/helpers/validate-formfields-helper';
import { PaginationListResponse } from 'src/app/site/core/models/pagination-list-response';
import { PaymentMethodInfo } from '../../../models/entitys/paymentmethodinfo';
import { paymentInsertRequest } from '../../../models/request/paymentinsertrequest';
import { CatalogService } from '../../../services/catalog.service';
import * as Feather from 'feather-icons';
import { paymentSetStatusRequest } from '../../../models/request/paymentsetstatusrequest';
import { AlertModalComponent } from 'src/app/site/shared-components/alert-modal/alert-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdatePaymentmethodComponent } from '../update-paymentmethod/update-paymentmethod.component';

@Component({
  selector: 'app-get-paymentmethod',
  templateUrl: './get-paymentmethod.component.html',
  styleUrls: ['./get-paymentmethod.component.scss']
})
export class GetPaymentmethodComponent implements OnInit {
  paymentmethodlist: PaymentMethodInfo[];
  formSubmitAttempt: boolean;

  paymentForm: FormGroup;
  payment: paymentInsertRequest;

  validateForm = ValidateForm;
  statusBrands?: boolean = true;
  constructor(
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private catalogService: CatalogService,
    private modalService : NgbModal
  ) {}

  ngOnInit(): void {
    Feather.replace();
    this.formSubmitAttempt = true;
    this.getPayments();
    this.SetValidatorsPayment();
  }

  onSubmit() {
    if (this.paymentForm.valid) 
    {
      this.formSubmitAttempt = true;
      this.payment = this.paymentForm.value;
      this.catalogService.insertPaymentMethod(this.payment).subscribe(
        (request) => {
          this.toastr.success('Método de pago agregado','¡Correcto!');
          let newPayment = new PaymentMethodInfo();
          newPayment.paymentMethodID=request;
          newPayment.description=this.payment.Description;
          newPayment.status=true;
          this.paymentmethodlist.push(newPayment);
        },
        (error) => {
          console.log(error);
        }
      );
      this.paymentForm.reset();
    } 
    else 
    {
      this.validateForm.validateAllFormFields(this.paymentForm);
      this.formSubmitAttempt = false;
    }
  }
  
  setStatus(opt:number)
  {
    if(opt==0)
      this.statusBrands=null;
    if(opt==1)
      this.statusBrands=true;
    if(opt==2)
      this.statusBrands=false;
  }

  SelectPayment(payment:PaymentMethodInfo)
  {
    let modal = this.modalService.open(UpdatePaymentmethodComponent, { centered: true });

    modal.componentInstance.title = 'Actualizar información de Método de pago';
    modal.componentInstance.payment=payment;

    modal.result
      .then((result) => {
        if (result) {
        }
      })
      .catch((err) => {});
  }

  async getPayments() {
    var response = await this.catalogService.getPaymentMethods().toPromise();
    this.paymentmethodlist= response;
  }

  validationInput(field: string): boolean {
    return this.paymentForm.get(field).errors != undefined;
  }

  SetValidatorsPayment() {
    this.paymentForm = this._formBuilder.group({
      Description: new FormControl('', [
        Validators.required,
        Validators.maxLength(25),
      ])
    });
  }

  del(payment:PaymentMethodInfo)
  {
    let modal = this.modalService.open(AlertModalComponent, { centered: true });

    modal.componentInstance.title = 'Confirmar eliminación de método de pago';
    modal.componentInstance.message =
      '¿Desea eliminar ' + payment.description  + '?';

    modal.result
      .then((result) => {
        if (result) {
          this.SetStatusPaymentMethod(payment, false);
        }
      })
      .catch((err) => {});
  }

  SetStatusPaymentMethod(payment: PaymentMethodInfo, stat: boolean) {
    const RequestDelete = new paymentSetStatusRequest();
    RequestDelete.PaymentMethodID = payment.paymentMethodID;
    RequestDelete.Status = stat;
    
    this.catalogService.deletePayment(RequestDelete).subscribe(
      (response) => {
        payment.status = stat;
        if (payment.status)
          this.toastr.success(
            'Método de pago activado correctamente',
            '¡Correcto!'
          );
        else 
        {
          this.toastr.success('Método de pago deshabilitado correctamente','¡Eliminación!');
        }
      },
      (error) => console.log(error)
    );
  }

  RestorePayment(payment:PaymentMethodInfo) {
    let modal = this.modalService.open(AlertModalComponent, { centered: true });

    modal.componentInstance.title = 'Restauración de método de pago';
    modal.componentInstance.message =
      '¿Desea activar: ' + payment.description +'?';

    modal.result
      .then((result) => {
        if (result) {
          this.SetStatusPaymentMethod(payment, true);
        }
      })
      .catch((err) => {});
  }
}
