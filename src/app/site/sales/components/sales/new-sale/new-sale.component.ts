import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ValidateForm } from 'src/app/site/core/helpers/validate-formfields-helper';
import { ProductInfo } from 'src/app/site/products/models/productInfo';
import { ProductService } from 'src/app/site/products/services/product.service';
import { SearchModalComponent } from 'src/app/site/shared-components/search-modal/search-modal.component';
import { InsertContentSaleRequest } from '../../../models/request/insertcontentsalerequest';
import { InsertPendingPaymentRequest } from '../../../models/request/insertpendingpayment';
import { InsertSaleRequest } from '../../../models/request/insertsalerequest';
import * as moment from 'moment';
import { PaySaleModalComponent } from 'src/app/site/shared-components/pay-sale-modal/pay-sale-modal.component';

@Component({
  selector: 'app-new-sale',
  templateUrl: './new-sale.component.html',
  styleUrls: ['./new-sale.component.scss'],
})
export class NewSaleComponent implements OnInit {
  user:string=localStorage.getItem('name');
  userID:number=parseInt(localStorage.getItem('userid'));

  
  IVA: number = 16;
  listProductsForSale = new Array<InsertContentSaleRequest>();
  insertSaleRequest: InsertSaleRequest;

  listProducts: ProductInfo[];

  saleForm:FormGroup;

  formSubmitAttempt: boolean;

  subtotal:number=0.00;
  total:number=0.00;
  costIVA:number=0.00;

  date=new Date();

  validateForm = ValidateForm;
  constructor(private productService: ProductService,
    private _formBuilder: FormBuilder,
    private toastr:ToastrService,
    private modalService : NgbModal){}

  ngOnInit(): void {
    this.getProducts();
    this.SetValidatorSale();
    moment().locale('es');
    this.formatDate(this.date);
  }

  openTransaction()
  {
      let modal = this.modalService.open(PaySaleModalComponent, {
        centered: true,
      });

      this.insertSaleRequest=new InsertSaleRequest();
      this.insertSaleRequest.userID=parseInt(localStorage.getItem('userid'));
      this.insertSaleRequest.products=this.listProductsForSale;

      modal.componentInstance.total=this.total;
      modal.componentInstance.saleRequest=this.insertSaleRequest;
      
      modal.result
        .then((result) => {
          if (result) 
          {}
        })
        .catch((err) => {});
  }


  async getProducts() {
    let products = await this.productService.getAvailableProducts().toPromise();
    if (products) {
      this.listProducts = products;
    }
  }

  onReceive($event)
  {
    let receivedProd=$event.item as ProductInfo;
    let searchProduct=this.listProductsForSale.find((d)=>d.productID==receivedProd.productID);
      if(searchProduct)
      {
        if(this.listProductsForSale.length>0)
        {
          let index = this.listProductsForSale.findIndex(d=>d.productID==searchProduct.productID)
          if(index>=0)
          {
            this.addQuantity(index);
          }
          else
          {
            this.asignProdValues(receivedProd);
          }
        }
        else
        {
          this.asignProdValues(receivedProd);
        }
        this.saleForm.get('inputCode').setValue("");
      }
  }


  onEnter(event: KeyboardEvent) {
    if(this.saleForm.get('inputCode').valid)
    {
      let searchProduct=this.listProducts.find(d=>d.code==this.saleForm.get('inputCode').value);
      if(searchProduct)
      {
        if(this.listProductsForSale.length>0)
        {
          let index = this.listProductsForSale.findIndex(d=>d.productID==searchProduct.productID)
          if(index>=0)
          {
            this.addQuantity(index);
          }
          else
          {
            this.asignProdValues(searchProduct);
          }
        }
        else
        {
          this.asignProdValues(searchProduct);
        }
        this.saleForm.get('inputCode').setValue("");
      }
      else
        this.toastr.error('Código de producto no encontrado','Error');
    }
  }


  searchProduct() {
    let modal = this.modalService.open(SearchModalComponent, {
      centered: true,
    });

    modal.componentInstance.products = this.listProducts;

    modal.result
      .then((result) => {
        if (result) {
          this.toastr.success('Producto agregado al recibo', 'Correcto');
          let duplicateProd = this.listProducts.findIndex(prod=>prod.productID==this.listProducts[this.listProducts.length-1].productID);
          if(duplicateProd<this.listProducts.length-1)
          {
            this.listProducts.splice(duplicateProd,1);
          }
          let searchProduct=this.listProductsForSale.findIndex(d=>d.productID==this.listProducts[this.listProducts.length-1].productID);
          if(searchProduct>=0)
          {
            this.addQuantity(searchProduct);
          }
          else
          {
            this.asignProdValues(this.listProducts[this.listProducts.length-1]);
          }
        }
      })
      .catch((err) => {});
  }

  SetValidatorSale() {
    this.saleForm = this._formBuilder.group({
      inputCode: new FormControl('', [
        Validators.maxLength(25)]),
    });
  }

  validationInput(field: string): boolean {
    return this.saleForm.get(field).errors != undefined;
  }
  
  addQuantity(i:number)
  {
    let quantity =this.listProductsForSale[i].quantity;
    if(quantity<this.listProducts.find(d=>d.productID==this.listProductsForSale[i].productID).stock)
    {
      this.listProductsForSale[i].quantity=this.listProductsForSale[i].quantity+1;
      this.calculate();
    }
  }

  removeQuantity(i:number)
  {
    let quantity =this.listProductsForSale[i].quantity;
    if(quantity>1)
    {
      this.listProductsForSale[i].quantity=quantity-1;
      this.calculate();
    }
  }

  asignProdValues(searchProduct:ProductInfo)
  {
    let insertProdRequest = new InsertContentSaleRequest;
    insertProdRequest.productID=searchProduct.productID;
    insertProdRequest.quantity=1;
    insertProdRequest.discount=0;
    insertProdRequest.nameProduct=searchProduct.productName;
    insertProdRequest.price=searchProduct.normalPrice;
    insertProdRequest.description=searchProduct.description;
    this.listProductsForSale.push(insertProdRequest);
    this.calculate();
  }

  calculate()
  {
    this.subtotal=parseFloat(this.listProductsForSale.map(d=>d.price*d.quantity).reduce((x,a)=>x+a).toFixed(2));
    this.costIVA=parseFloat((this.subtotal*(this.IVA/100)).toFixed(2));
    this.total=parseFloat((this.costIVA+this.subtotal).toFixed(2));
  }

  delItem(i:number)
  {
    this.listProductsForSale.splice(i,1);
    if(this.listProductsForSale.length==0)
    {
      this.subtotal=0.00;
      this.costIVA=0.00;
      this.total=0.00;
    }
    else
    {
      this.calculate();
    }
  }

  formatDate(date: Date) {
    return new Date(date);
  }
    
  
}
