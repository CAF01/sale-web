import { Component, DebugElement, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { client } from 'src/app/site/clients/models/entitys/client';
import { insertClientRequest } from 'src/app/site/clients/models/request/insertclientrequest';
import { RedirectHelper } from 'src/app/site/core/helpers/redirect-helper';
import { ValidateForm } from 'src/app/site/core/helpers/validate-formfields-helper';
import { ProductInfo } from 'src/app/site/products/models/productInfo';
import { InsertContentSaleRequest } from '../../../models/request/insertcontentsalerequest';
import { InsertPendingPaymentRequest } from '../../../models/request/insertpendingpayment';
import { InsertSaleRequest } from '../../../models/request/insertsalerequest';
import { SalesService } from '../../../services/sales.service';

@Component({
  selector: 'app-update-sale',
  templateUrl: './update-sale.component.html',
  styleUrls: ['./update-sale.component.scss']
})
export class UpdateSaleComponent implements OnInit {
  selectedItems:boolean=false;
  viewOne:boolean=true;
  viewTwo:boolean=false;
  viewThree: boolean=false;
  selectedClient:boolean=false;
  redirectHelper = RedirectHelper;
  user:string=localStorage.getItem('name');
  userID:number=parseInt(localStorage.getItem('userid'));

  infoClient:client=new client();
  IVA: number = 16;
  listProductsForSale : InsertContentSaleRequest[] = [];
  insertSaleRequest: InsertSaleRequest;

  listProducts: ProductInfo[]=[];
  insertPendingPaymentRequest: InsertPendingPaymentRequest;
  saleForm:FormGroup;
  payForm:FormGroup;
  percent=550;

  formSubmitAttempt: boolean;

  subtotal:number=0.00;
  total:number=0.00;
  costIVA:number=0.00;
  paying:number;
  date=new Date();

  validateForm = ValidateForm;
  viewFour: boolean;
  
  constructor(
    private _formBuilder: FormBuilder,
    private toastr:ToastrService,
    private router: Router,
    private saleService:SalesService){}

  ngOnInit(): void {
    this.SetValidatorSale();
    this.SetValidatorsPay();
    moment().locale('es');
    this.formatDate(this.date);
    if(sessionStorage.listProducts)
    {
      this.setValuesAfterRegister();
      this.steptwo();
    }
    else
    {
      this.saleForm.get('quant').setValue(1);
    }
  }


  async pay()
  {
    if(this.payForm.get('pay').valid)
    {
      this.insertSaleRequest=new InsertSaleRequest();
      this.insertSaleRequest.paymentMethodID=2;//Efectivo
      this.insertSaleRequest.clientID=this.infoClient.clientID;
      this.insertPendingPaymentRequest=new InsertPendingPaymentRequest();
      this.insertSaleRequest.userID=this.userID;
      this.insertSaleRequest.products=this.listProductsForSale;
      if(this.total<this.payForm.get('pay').value)
      {
        this.payForm.get('pay').setValue(this.total);
      }
      this.insertPendingPaymentRequest.payed=this.payForm.get('pay').value;
      this.insertSaleRequest.pendingPayment=this.insertPendingPaymentRequest;
      var response = await this.saleService.CreateSale(this.insertSaleRequest).toPromise();
      if(response>0)
      {
        this.toastr.success('Venta realizada','Correcto');
        this.viewFour=false;
        this.reset();
        this.stepone();
      }
    }

  }

  setValuesAfterRegister()
  {
    this.listProducts= JSON.parse(sessionStorage.list) as ProductInfo[];
    this.listProductsForSale= JSON.parse(sessionStorage.listProducts) as InsertContentSaleRequest[];
    if(sessionStorage.clientInfo)
    {
      var objCLient = JSON.parse(sessionStorage.clientInfo) as insertClientRequest;
      this.infoClient.firstName=objCLient.firstName+" "+objCLient.lastName;
      this.infoClient.phone=objCLient.phone;
      this.infoClient.email=objCLient.email;
      this.infoClient.notes=objCLient.notes;
      this.infoClient.clientID=Number(sessionStorage.clientID);
      this.selectedClient=true;
      sessionStorage.removeItem('clientInfo');
      sessionStorage.removeItem('clientID');
    }
    this.selectedItems=true;
    sessionStorage.removeItem('listProducts');
    sessionStorage.removeItem('list');
    this.calculate();
  }


  onReceive($event)
  {
    let receivedProd=$event as ProductInfo;
    let product = this.listProducts.findIndex((d)=>d.productID==receivedProd.productID);
    if(product>=0)
      receivedProd=this.listProducts[product];
    else
      this.listProducts.push(receivedProd);  
    if(receivedProd.stock>=1)
    {
      if(this.listProductsForSale.length>0)
      {
        let searchProduct=this.listProductsForSale.findIndex((d)=>d.productID==receivedProd.productID);
        if(searchProduct>=0)
            this.addQuantity(searchProduct);
        else
          this.asignProdValues(receivedProd);
      }
      else
        this.asignProdValues(receivedProd);
    }
    else
      this.toastr.error(`${receivedProd.productName} agotado`,'Agotado');
  }

  amount(price,quant)
  {
    return parseFloat((price * quant).toFixed(2));
  }

  SetValidatorSale() {
    this.saleForm = this._formBuilder.group({
      quant: new FormControl('', []),
    });
  }
  SetValidatorsPay() {
    this.payForm = this._formBuilder.group({
      total: new FormControl('',[]),
      debt:new FormControl('',[]),
      pay:new FormControl('',[])
    });

    this.payForm.get('total').setValue(0);
    this.payForm.get('debt').setValue(0);
    this.payForm.get('pay').setValue(0);
    this.payForm.controls['total'].disable();
    this.payForm.controls['debt'].disable();
  }

  refreshPay()
  {
    this.paying=this.payForm.get('pay').value;
    if(this.paying>this.total)
    {
      this.payForm.get('debt').setValue(parseFloat((this.paying-this.total).toFixed(2)));
    }
    else
    {
      this.payForm.get('debt').setValue(0.00);
    }
  }

  validationInput(field: string): boolean {
    return this.saleForm.get(field).errors != undefined;
  }
  
  addQuantity(i:number)
  {
    if(this.listProducts.find(d=>d.productID==this.listProductsForSale[i].productID).stock>=1)
    {
      this.listProductsForSale[i].quantity+=1;
      // let prod = this.listProducts.findIndex((d)=>d.productID==this.listProductsForSale[i].productID);
      // this.listProducts[prod].stock-=1;
      this.calculate();
    }
  }

  removeQuantity(i:number)
  {
    let quantity =this.listProductsForSale[i].quantity;
    if(quantity>1)
    {
      this.listProductsForSale[i].quantity-=1;
      // let prod = this.listProducts.findIndex((d)=>d.productID==this.listProductsForSale[i].productID);
      // this.listProducts[prod].stock+=1;
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
    // let prodIndex = this.listProducts.findIndex((d)=>d.productID==searchProduct.productID);
    // this.listProducts[prodIndex].stock-=1;
    this.calculate();
  }

  calculate()
  {
    this.subtotal=parseFloat(this.listProductsForSale.map(d=>d.price*d.quantity).reduce((x,a)=>x+a).toFixed(2));
    this.costIVA=parseFloat((this.subtotal*(this.IVA/100)).toFixed(2));
    this.total=parseFloat((this.costIVA+this.subtotal).toFixed(2));
    this.payForm.get('total').setValue(this.total);
    this.refreshPay();
    if(this.listProductsForSale.length>0)
      this.selectedItems=true;
  }

  delItem(i:number)
  {
    this.listProductsForSale.splice(i,1);
    if(this.listProductsForSale.length==0)
    {
      this.subtotal=0.00;
      this.costIVA=0.00;
      this.total=0.00;
      this.selectedItems=false;
    }
    else
      this.calculate();
  }

  stock(i)
  {
    return this.listProducts.find((d)=>d.productID==this.listProductsForSale[i].productID).stock;
  }

  formatDate(date: Date) {
    return new Date(date);
  }

  onEnter(event: KeyboardEvent,i,input) {
    if(this.listProductsForSale[i].quantity!=input.value)
    {
      let posProdOriginalList = this.listProducts.findIndex((d)=>d.productID==this.listProductsForSale[i].productID);
      // let quant:number = Number(this.listProductsForSale[i].quantity);
      // this.listProducts[posProdOriginalList].stock=Number(this.listProducts[posProdOriginalList].stock)+Number(quant);
      if(input.value<=this.listProducts[posProdOriginalList].stock)
      {
        this.listProductsForSale[i].quantity=input.value;
        // this.listProducts[posProdOriginalList].stock=this.listProducts[posProdOriginalList].stock-input.value;
      }
      else
      {
        this.listProductsForSale[i].quantity=this.listProducts[posProdOriginalList].stock;
      }
      this.calculate();
    }
  }

  onReceiveClient($event)
  {
    this.infoClient=$event as client;
    this.selectedClient=true;
  }

  registerClient()
  {
    sessionStorage.setItem('list',JSON.stringify(this.listProducts));
    sessionStorage.setItem('listProducts', JSON.stringify(this.listProductsForSale));
    this.router.navigate(['home/clients/insert-client']);
  }

  steptwo()
  {
    this.viewOne=false;
    this.viewTwo=true;
    this.viewThree=false;
    this.viewFour=false;
    this.Redirect('#wizard2');
  }
  stepone()
  {
    this.viewOne=true;
    this.viewTwo=false;
    this.viewThree=false;
    this.viewFour=false;
    this.Redirect('#wizard1');
  }
  stepthree()
  {
    this.viewTwo=false;
    this.viewThree=true;
    this.viewFour=false;
    this.viewOne=false;
    this.Redirect('#wizard3');
  }
  stepfour()
  {
    this.viewTwo=false;
    this.viewThree=false;
    this.viewFour=true;
    this.viewOne=false;
    this.Redirect('#wizard4');
  }

  reset()
  {
    this.saleForm.reset();
    this.payForm.reset();
    this.saleForm.get('quant').setValue(1);
    this.selectedClient=false;
    sessionStorage.removeItem('clientInfo');
    sessionStorage.removeItem('clientID');
    this.selectedItems=false;
    sessionStorage.removeItem('listProducts');
    sessionStorage.removeItem('list');
    this.listProducts = [];
    this.listProductsForSale =[];
  }

  Redirect(focus) {
    this.redirectHelper.NextTab('#cardTab', focus);
  }
    
  
}
