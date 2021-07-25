import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalConfig, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { client } from '../../clients/models/entitys/client';
import { ClientService } from '../../clients/services/client.service';
import { ValidateForm } from '../../core/helpers/validate-formfields-helper';
import { InsertPendingPaymentRequest } from '../../sales/models/request/insertpendingpayment';
import { InsertSaleRequest } from '../../sales/models/request/insertsalerequest';
import { SalesService } from '../../sales/services/sales.service';

@Component({
  selector: 'app-pay-sale-modal',
  templateUrl: './pay-sale-modal.component.html',
  styleUrls: ['./pay-sale-modal.component.scss']
})
export class PaySaleModalComponent implements OnInit {
  @Input() total: number;
  @Input() saleRequest:InsertSaleRequest;

  insertPendingPaymentRequest: InsertPendingPaymentRequest;

  debt:number=0.00;
  paying:number=0.00;
  // @Input() message?: string;
  // @Input() products?: Array<ProductInfo>;
  active;
  disabled = true;

  clientList : client;
  founded=true;
  // finded=false;
  
  constructor(
    public modal: NgbActiveModal,
    private clientService:ClientService,
    private _formBuilder: FormBuilder,
    private saleService:SalesService,
    private toastr:ToastrService,
    config:NgbModalConfig,private modalService:NgbModal
  ) {
    config.backdrop='static';
    config.keyboard=false;
  }

  ngOnInit(): void {
    this.SetValidatorSearch();
  }

  async onEnter(event: KeyboardEvent) {
    if(this.searchForm.get('searchingClient').valid)
    {
      var result = await this.clientService.getClientsByPhone(this.searchForm.get('searchingClient').value).toPromise();
      if(result)
      {
          this.clientList=result;
          this.founded=true;
      }
      else
      {
        this.founded=false;
        this.clientList=undefined;
      }
    }
    else
    {
      this.founded=false;
      this.clientList=undefined;  
    }
  }

  async pay()
  {
    if(this.searchForm.get('paying').valid)
    {
      this.saleRequest.paymentMethodID=2;
      this.saleRequest.clientID=this.clientList.clientID;
      this.insertPendingPaymentRequest=new InsertPendingPaymentRequest();
      if(this.total<this.paying)
      {
        this.paying=this.total;
      }
      this.insertPendingPaymentRequest.payed=this.paying;
      this.saleRequest.pendingPayment=this.insertPendingPaymentRequest;
      var response = await this.saleService.CreateSale(this.saleRequest).toPromise();
      if(response>0)
      {
        this.toastr.success('Venta realizada','Correcto');
        console.log(response);
      }
    }
    else
    {

    }

  }

  onNavChange(changeEvent: NgbNavChangeEvent) {
    if (changeEvent.nextId === 3) {
      changeEvent.preventDefault();
    }
  }

  toggleDisabled() {
    this.disabled = !this.disabled;
    if (this.disabled) {
      this.active = 1;
    }
  }

  submitAttempt: boolean = true;
  searchForm: FormGroup;

  validateForm = ValidateForm;

  SetValidatorSearch() {
    this.searchForm = this._formBuilder.group({
      searchingClient: new FormControl('', [Validators.required,Validators.maxLength(10),Validators.minLength(10)]),
      paying: new FormControl('',[Validators.required])
    });
  }

  validationInputInvoice(field: string): boolean 
  {
    return this.searchForm.get(field).errors != undefined;
  }

  calculate()
  {
    this.paying=this.searchForm.get('paying').value;
    if(this.paying>this.total)
    {
      this.debt=parseFloat((this.paying-this.total).toFixed(2));
    }
    else
    {
      this.debt=0.00;
    }
  }
}



// @Input() title: string;
  // @Input() message?: string;
 // @Input() products?: Array<ProductInfo>;



