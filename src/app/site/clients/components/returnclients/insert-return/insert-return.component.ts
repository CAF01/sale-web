import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as Feather from 'feather-icons';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { UpdateReasonreturnclientComponent } from 'src/app/site/catalogs/components/reasonreturnclients/update-reasonreturnclient/update-reasonreturnclient.component';
import { ReasonReturnInfo } from 'src/app/site/catalogs/models/entitys/reasonreturninfo';
import { ValidateForm } from 'src/app/site/core/helpers/validate-formfields-helper';
import { ContentSaleInfo } from 'src/app/site/sales/models/entitys/contentsaleinfo';
import { SalesInfo } from 'src/app/site/sales/models/entitys/salesinfo';
import { SalesService } from 'src/app/site/sales/services/sales.service';
import { ProductReturned } from '../../../models/entitys/productreturned';
import { InsertReturnClientRequest } from '../../../models/request/insertreturnclientrequest';
import { ClientService } from '../../../services/client.service';

export class modifing {
  changed:boolean;
  realQuant:number;
  idProd:number;
};

@Component({
  selector: 'app-insert-return',
  templateUrl: './insert-return.component.html',
  styleUrls: ['./insert-return.component.scss'],
})
export class InsertReturnComponent implements OnInit {
  constructor(
    private _formBuilder: FormBuilder,
    private saleService: SalesService,
    private toastr: ToastrService,
    private clientService: ClientService,
    private modalService: NgbModal
  ) {}

  dynamicForm: FormGroup;
  existReturned:boolean=false;
  checks:any[]=[];
  checkallControl:any;
  ngOnInit(): void {
    Feather.replace();
    moment().locale('es');
    this.SetValidatorSearch();
    this.SetValidatorReturn();
    this.getReasons();
    this.dynamicForm = this._formBuilder.group({
      numberOfTickets: ['', Validators.required],
      products: new FormArray([])
    });
  }

  formatDate(date: Date) {
    return new Date(date);
  }

  get f() { return this.dynamicForm.controls; }
  get t() { return this.f.products as FormArray; }

  saleInfo: SalesInfo;
  searchForm: FormGroup;
  returnForm: FormGroup;
  contentSale: ContentSaleInfo[];
  contentToReturn: ContentSaleInfo[]=[];
  selected: ContentSaleInfo;
  reasons: ReasonReturnInfo[];
  ListReturneds: ProductReturned[];
  historial: boolean = false;
  checkAll:boolean=false;
  Validando : modifing[]=null;

  validateForm = ValidateForm;

  SetValidatorSearch() {
    this.searchForm = this._formBuilder.group({
      searchID: new FormControl('', [
        Validators.required,
        Validators.maxLength(10),
        Validators.min(1),
        Validators.max(99999),
      ]),
    });
  }
  SetValidatorReturn() {
    this.returnForm = this._formBuilder.group({
      quantity: new FormControl('', [
        Validators.required,
        Validators.maxLength(5),
        Validators.min(1),
        Validators.max(5000),
      ]),
      reasonID: new FormControl('', [Validators.required, Validators.min(1)]),
    });
  }

  async getReasons() {
    var response = await this.clientService.getReasons().toPromise();
    if (response) {
      this.reasons = response;
      this.returnForm.get('reasonID').setValue(this.reasons[0].reasonID);
    } else {
      this.toastr.error('Fallo al cargar razones', 'Error');
    }
  }

  getReturneds() {
    this.clientService.getReturnedProds(this.saleInfo.saleID).subscribe(request=>
      {
        if(request[0])
        {
          this.historial=true;
          this.ListReturneds=[];
          this.ListReturneds = request;
          this.realQuantV2();
        }
        else
        {
          this.ListReturneds=null;
          this.historial = false;
        }
        
      },error=>
      {
        this.ListReturneds=null;
        console.log(error);
        this.historial = false;
      });
  }

  onCheckboxChange(e,item:ContentSaleInfo)
  {
    //checked
    if(e.currentTarget.checked)
    {
      this.checks.push(e);
      let valid=false;
      this.selected = item;
      if (this.Validando) 
      {
        let index = this.contentSale.findIndex(d=>d.contentSaleID==this.selected.contentSaleID);
        if(index>=0)
          this.Validando[index].realQuant>0 ? valid=true : false;
      } 
      else 
        valid=true;
      if(valid)
      {
        this.t.push(this._formBuilder.group({quantity:[null, [Validators.required, Validators.min(1)]],
          totalPrice: [null, [Validators.required, Validators.min(1)]],
          reasonID: [null, [Validators.required, Validators.min(1)]],
        }));
        this.t.controls[this.t.controls.length-1].get('quantity').setValue(1);
        this.t.controls[this.t.controls.length-1].get('reasonID').setValue(this.reasons[0].reasonID);
        this.t.controls[this.t.controls.length-1].get('totalPrice').setValue(this.selected.unitPrice*1);
        this.t.controls[this.t.controls.length-1].get('totalPrice').disable();

        this.contentToReturn.push(this.selected);
      }

    }//unchecked
    else
    {
      let inChec=this.checks.findIndex(d=>d==e);
      this.checks.splice(inChec,1);
      let index = this.contentToReturn.findIndex(d=>d.contentSaleID==item.contentSaleID);
      this.t.removeAt(index);
      this.contentToReturn.splice(index,1);
    }
  }

  selectAll(e)
  {
    this.checkallControl=e;
    this.checkAll==false ? this.checkAll=true : this.checkAll=false;
    if(e.currentTarget.checked)//checked
    {
      if(this.contentToReturn && this.t.controls.length>=1)
      {
        this.contentSale.forEach(element => {
          let valQuant = this.Validando.find(d=>d.idProd==element.contentSaleID);
          if(!this.contentToReturn.find(d=>d.contentSaleID==element.contentSaleID))
          {
            if(valQuant.realQuant>0)
            {
              this.t.push(this._formBuilder.group({quantity:[null, [Validators.required, Validators.min(1)]],
                totalPrice: [null, [Validators.required, Validators.min(1)]],
                reasonID: [null, [Validators.required, Validators.min(1)]],
              }));
              this.t.controls[this.t.controls.length-1].get('quantity').setValue(1);
              this.t.controls[this.t.controls.length-1].get('reasonID').setValue(this.reasons[0].reasonID);
              this.t.controls[this.t.controls.length-1].get('totalPrice').setValue(element.unitPrice*1);
              this.t.controls[this.t.controls.length-1].get('totalPrice').disable();
      
              this.contentToReturn.push(element);
            }
          }
        });
      }
      else
      {
        this.checks=[];
        this.contentSale.forEach(element => {
          let valQuant = this.Validando.find(d=>d.idProd==element.contentSaleID);
          if(valQuant.realQuant>0)
          {
            this.t.push(this._formBuilder.group({quantity:[null, [Validators.required, Validators.min(1)]],
              totalPrice: [null, [Validators.required, Validators.min(1)]],
              reasonID: [null, [Validators.required, Validators.min(1)]],
            }));
            this.t.controls[this.t.controls.length-1].get('quantity').setValue(1);
            this.t.controls[this.t.controls.length-1].get('reasonID').setValue(this.reasons[0].reasonID);
            this.t.controls[this.t.controls.length-1].get('totalPrice').setValue(element.unitPrice*1);
            this.t.controls[this.t.controls.length-1].get('totalPrice').disable();
      
            this.contentToReturn.push(element);
          }
        });
      }
    }
    else
    {
      this.cancel();
    }
  }

  async onEnter(event: KeyboardEvent) {
    if (this.searchForm.valid) {
      this.reset();
      let request = await this.saleService.getSaleByID(this.searchForm.get('searchID').value).toPromise();
      if(request)
      {
        this.saleInfo = request;
        await this.getContentSale(this.searchForm.get('searchID').value);
        this.getReturneds();
      }
      else
      {
        this.toastr.error('El número de referencia no existe', 'Error');
      }
    } else 
    {
      this.validateForm.validateAllFormFields(this.searchForm);
    }
  }

  async getContentSale(id: number) {
    var response = await this.saleService.getContentSaleByID(id).toPromise();
    if (response.length > 0) {
      this.contentSale = response;
    }
  }

  validationInputInvoice(field: string): boolean {
    return this.searchForm.get(field).errors != undefined;
  }


  async return() {
    let request : InsertReturnClientRequest[]=[];
    let i = 0;
    while(i<this.contentToReturn.length)
    {
      let item = new InsertReturnClientRequest();
      item.contentSaleID=this.contentToReturn[i].contentSaleID;
      item.userID = parseInt(localStorage.getItem('userid'));
      item.quantity=this.t.controls[i].get('quantity').value;
      item.reasonID=this.t.controls[i].get('reasonID').value;
      request.push(item);
      i++;
    }
    var response = await this.clientService.newReturn(request).toPromise();
    if (response > 0) 
    {
      if (this.ListReturneds) 
      {
        this.asignValuesToNewReturned(request);
      } 
      else 
      {
        this.ListReturneds = [];
        this.asignValuesToNewReturned(request);
        this.ListReturneds.length >= 1 ? this.historial = true : false;
      }
      this.toastr.success('Devolución realizada', 'Correcto');
      this.cancel();
    }
  }

  asignValuesToNewReturned(request: InsertReturnClientRequest[]) {
    let i = 0;
    while (i<request.length)
    {
      let prod = new ProductReturned();
      prod.contentSaleID = request[i].contentSaleID;
      prod.product = this.contentToReturn[i].productName + ' ' + this.contentToReturn[i].model;
      prod.registerDate = new Date();
      prod.saleID = this.saleInfo.saleID;
      prod.quantity=request[i].quantity;
      prod.totalPrice = this.t.controls[i].get('totalPrice').value;
      let reason = this.reasons.find((d) => d.reasonID == request[i].reasonID);
      prod.description = reason.description;
      prod.observation = reason.observation;
      this.ListReturneds.push(prod);
      i++;
    }
    this.realQuantV2();
  }

  cancel() {
    for(let i=0;i<this.checks.length;i++)
    {
      this.checks[i].target.checked=false;
    }
    this.checks=[];
    this.t.controls=[];
    this.t.reset();
    this.checkAll=false;
    this.contentToReturn=[];
    this.checkallControl.target.checked=false;
  }

  validateQuantity(i:number)
  {
    let quantForm = this.t.controls[i].get('quantity').value;
    if(quantForm<1)
    {
      quantForm=1;
      this.t.controls[i].get('quantity').setValue(1);
    }
    else
    {
      if(this.Validando)
      {
        let index = this.contentSale.findIndex(d=>d.contentSaleID==this.contentToReturn[i].contentSaleID);
        quantForm<=this.Validando[index].realQuant ? true : this.t.controls[i].get('quantity').setValue(this.Validando[index].realQuant);
        quantForm = this.t.controls[i].get('quantity').value;
        this.t.controls[i].get('totalPrice').setValue(parseFloat((quantForm*this.contentToReturn[i].unitPrice).toFixed(2)));
      }
      else
      {
        quantForm<=this.contentToReturn[i].quantity ? true : this.t.controls[i].get('quantity').setValue(this.contentToReturn[i].quantity);
        quantForm = this.t.controls[i].get('quantity').value;
        this.t.controls[i].get('totalPrice').setValue(parseFloat((quantForm*this.contentToReturn[i].unitPrice).toFixed(2)));
      }
    }
  }

  ReturnAll() {
    this.toastr.info('Obra negra', 'Bastardo');
  }

  addReason() {
    let modal = this.modalService.open(UpdateReasonreturnclientComponent, {
      centered: true,
    });

    modal.componentInstance.title = 'Agregar razón de devolución';
    modal.componentInstance.reasonList = this.reasons;
    modal.componentInstance.ModalNum = 1;

    modal.result
      .then((result) => {
        if (result) {
        }
      })
      .catch((err) => {});
  }

  realQuantV2()
  {
    if(this.contentSale && this.ListReturneds)
    {
      this.Validando=[];
      this.contentSale.forEach((element) => {
        let validando = new modifing();
        validando.idProd=element.contentSaleID;
        let prodReturned = this.ListReturneds.filter(d=>d.contentSaleID==validando.idProd);
        if(prodReturned.length>=1)
        {
          validando.realQuant=((element.quantity)-(prodReturned.map(d=>(d.quantity*1)).reduce((x,e)=>x+e)))*1;
          validando.changed=true;
        }
        else
        {
          validando.realQuant=element.quantity;
          validando.changed=false;
        }
        this.Validando.push(validando);
      });
      this.existReturned=true;
    }
    else
    {
      this.existReturned=false;
    }
  }
  // calcRealQuant()
  // {
  //   if(this.contentSale)
  //   {
  //     this.Validando=[];
  //     let contentToReturnv2: ProductReturned[]=[];
  //     let i=0;
  //     let lista:ProductReturned[]=[];
  //     let acum=null;
  //     while(i<this.ListReturneds.length)
  //     {
  //       let content = contentToReturnv2.find(d=>d.contentSaleID==this.ListReturneds[i].contentSaleID);
  //       if(!content)
  //       {
  //         contentToReturnv2.push(this.ListReturneds[i]);
  //         content=contentToReturnv2[contentToReturnv2.length-1];
  //       }
  //       lista = this.ListReturneds.filter(d=>d.contentSaleID==this.ListReturneds[i].contentSaleID);
  //       acum = lista.map(d=>Number(d.quantity)).reduce((x,e)=>(x+e));
  //       let findex = contentToReturnv2.findIndex(d=>d.contentSaleID==content.contentSaleID);
  //       contentToReturnv2[findex].quantity=acum;
  //       i++;
  //     }
  //     for(let i=0;i<this.contentSale.length;i++)
  //     {
  //       let mod = contentToReturnv2.find(d=>d.contentSaleID==this.contentSale[i].contentSaleID);
  //       let newVal = new modifing;
  //       if(mod!=undefined)
  //       {
  //         newVal.changed=true;
  //         newVal.realQuant=this.contentSale[i].quantity-mod.quantity;
  //       }
  //       else
  //       {
  //         newVal.changed=false;
  //         newVal.realQuant=this.contentSale[i].quantity;
  //       }
  //       this.Validando.push(newVal);
  //     }
  //   this.existReturned=true;
  //   }
  // }

  calcAmount(p,x)
  {
    return parseFloat((p*x).toFixed(2));
  }
  reset()
  {
    this.returnForm.reset();
    this.historial=false;
    this.saleInfo=null;
    this.ListReturneds=null;
    this.selected=null;
    this.contentSale=null;
    this.dynamicForm.reset();
    this.t.reset();
    this.existReturned=false;
    this.Validando=null;
  }
}
