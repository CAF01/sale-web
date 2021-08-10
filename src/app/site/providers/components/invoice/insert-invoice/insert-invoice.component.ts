import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ProductInfo } from 'src/app/site/products/models/productInfo';
import { ProductService } from 'src/app/site/products/services/product.service';
import { ProviderInfo } from '../../../models/entitys/provider';
import { ProviderService } from '../../../services/provider.service';
import * as Feather from 'feather-icons';
import { InsertContentRequest } from '../../../models/request/insertcontentrequest';
import { ValidateForm } from 'src/app/site/core/helpers/validate-formfields-helper';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchModalComponent } from 'src/app/site/shared-components/search-modal/search-modal.component';
import { InsertInvoiceRequest } from '../../../models/request/insertinvoicerequest';

@Component({
  selector: 'app-insert-invoice',
  templateUrl: './insert-invoice.component.html',
  styleUrls: ['./insert-invoice.component.scss'],
})
export class InsertInvoiceComponent implements OnInit {
  providers: ProviderInfo[];
  products: ProductInfo[];

  listContentInvoice: Array<InsertContentRequest>;
  BackuplistContentInvoice: Array<InsertContentRequest>;

  provSelected: boolean = false;
  provID: number;
  BackupProvID: number;

  ProviderInfo: ProviderInfo;

  longProds: number = 0;

  invoiceForm: FormGroup;
  submitAproduct: boolean = false;
  submitAttempt: boolean = true;

  validateForm = ValidateForm;

  constructor(
    private providerService: ProviderService,
    private productService: ProductService,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    Feather.replace();
    this.SetValidatorInvoice();
    this.getProviders();
    this.getProducts();
  }

  onSubmit() {
    if (this.invoiceForm.valid) {
      this.calc();
      if (!this.provSelected) {
        if (this.BackuplistContentInvoice) {
          this.BackuplistContentInvoice = undefined;
          this.BackupProvID = undefined;
        }
        this.listContentInvoice = new Array<InsertContentRequest>();
        this.provSelected = true;

        this.ProviderInfo =
          this.providers[this.invoiceForm.get('providerID').value];

        this.provID =
          this.providers[this.invoiceForm.get('providerID').value].providerID;
        this.submitAproduct = true;
        this.submitAttempt = true;
      }
      let content = new InsertContentRequest();
      content = this.invoiceForm.value;
      content.productID =
        this.products[this.invoiceForm.get('productID').value].productID;
      content.productName =
        this.products[this.invoiceForm.get('productID').value].productName;
      content.description =
        this.products[this.invoiceForm.get('productID').value].description;
      content.model =
        this.products[this.invoiceForm.get('productID').value].model;
      this.listContentInvoice.push(content);
      this.SetValidatorWithProv(this.provID);
      this.invoiceForm.get('productID').setValue(0);
      this.longProds = this.listContentInvoice.length;
    } else {
      this.validateForm.validateAllFormFields(this.invoiceForm);
      this.submitAttempt = false;
      this.toastr.error('Completa los campos', 'Incompleto');
    }
  }

  saveInvoice() {
    let invoice = new InsertInvoiceRequest();
    invoice.providerID = this.provID;
    invoice.products = this.listContentInvoice;
    invoice.providerName = this.ProviderInfo.companyName;
    
    this.providerService.insertInvoice(invoice).subscribe(
      (request) => {
        this.BackuplistContentInvoice = undefined;
        this.BackupProvID = undefined;
        this.SetValidatorInvoice();
        this.submitAproduct = false;
        this.submitAttempt = true;
        this.provID = undefined;
        this.provSelected = false;
        this.listContentInvoice = undefined;
        this.ProviderInfo = undefined;
        this.invoiceForm.get('providerID').setValue(0);
        this.invoiceForm.get('productID').setValue(0);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  cancel() {
    if (this.listContentInvoice) {
      this.BackuplistContentInvoice = new Array<InsertContentRequest>();
      this.BackuplistContentInvoice = this.listContentInvoice;
      this.BackupProvID = this.provID;
      this.SetValidatorInvoice();
      this.submitAproduct = false;
      this.submitAttempt = true;
      this.provID = undefined;
      this.provSelected = false;
      this.listContentInvoice = undefined;
      this.ProviderInfo = undefined;
      this.invoiceForm.get('providerID').setValue(0);
      this.invoiceForm.get('productID').setValue(0);
    }
  }

  restore() {
    if (this.BackuplistContentInvoice && this.BackupProvID) {
      this.SetValidatorWithProv(this.BackupProvID);
      this.listContentInvoice = this.BackuplistContentInvoice;
      this.provID = this.BackupProvID;

      let currentProvider = this.providers.find(
        (provider) => provider.providerID == this.provID
      );

      this.ProviderInfo = currentProvider;

      this.BackuplistContentInvoice = undefined;
      this.BackupProvID = undefined;
      this.provSelected = true;
      this.submitAproduct = true;
      this.invoiceForm.get('productID').setValue(0);
    }
  }

  searchProduct() {
    let modal = this.modalService.open(SearchModalComponent, {
      centered: true,
    });

    modal.componentInstance.products = this.products;

    modal.result
      .then((result) => {
        if (result) {
          this.toastr.success('Producto agregado a la lista actual', 'Listo');
          let duplicateProd = this.products.findIndex(prod=>prod.productID==this.products[this.products.length-1].productID);
          if(duplicateProd<this.products.length-1)
          {
            this.products.splice(duplicateProd,1);
          }
          this.invoiceForm.get('productID').setValue(this.products.length - 1);
        }
      })
      .catch((err) => {});
  }

  validationInputInvoice(field: string): boolean {
    return this.invoiceForm.get(field).errors != undefined;
  }

  async getProviders() {
    var response = await this.providerService
      .getAvailableProviders()
      .toPromise();

    this.providers = response;

    this.invoiceForm.get('providerID').setValue(0);
  }

  async getProducts() {
    var response = await this.productService.getAvailableProducts().toPromise();
    this.products = response;
    console.log(this.products);
    this.invoiceForm.get('productID').setValue(0);
  }

  SetValidatorInvoice() {
    this.invoiceForm = this._formBuilder.group({
      providerID: new FormControl('', [Validators.required]),
      productID: new FormControl('', [Validators.required]),
      unitPrice: new FormControl('', [Validators.required]),
      amount: new FormControl(''),
      quantity: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]+$/),
        Validators.min(1),
      ]),
    });
    this.invoiceForm.get('amount').setValue(0);
  }

  SetValidatorWithProv(prov: number) {
    this.SetValidatorInvoice();
    this.invoiceForm.get('providerID').setValue(prov);
  }

  calc() {
    if (this.invoiceForm.get('unitPrice').value>0 && this.invoiceForm.get('quantity').value>0) 
    {
      let amount =this.invoiceForm.get('unitPrice').value * this.invoiceForm.get('quantity').value;
      if (amount >= 1000000) 
      {
        this.toastr.info('La cantidad calculada supera $1,000,000');
      }
      this.invoiceForm.get('amount').setValue(amount.toFixed(2));
    }
    else
    {
      this.invoiceForm.get('amount').setValue(0.00);
    }
  }
  delItem(pos: number) {
    this.listContentInvoice.splice(pos, 1);
    this.longProds = this.listContentInvoice.length;
    if (this.longProds == 0) {
      this.provSelected = false;
      this.ProviderInfo = null;
      this.invoiceForm.get('providerID').setValue(0);
    }
  }
}
