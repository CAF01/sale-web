import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import * as Feather from 'feather-icons';
import { ValidateForm } from 'src/app/site/core/helpers/validate-formfields-helper';
import { ReturnProductProviderInfo } from '../../../models/entitys/returnproductproviderinfo';
import { ReasonReturnProvider } from 'src/app/site/catalogs/models/entitys/reasonreturnproviderinfo';
import { InvoiceInfo } from '../../../models/entitys/invoiceinfo';
import { InvoiceContentInfo } from '../../../models/entitys/invoicecontentinfo';
import { ProviderService } from '../../../services/provider.service';
import { InsertReturnProviderRequest } from '../../../models/request/insertreturnproviderrequest';
import { UpdateReasonreturnclientComponent } from 'src/app/site/catalogs/components/reasonreturnclients/update-reasonreturnclient/update-reasonreturnclient.component';
import * as moment from 'moment';

export class modifing {
  changed:boolean;
  realQuant:number;
  idProd:number;
};

@Component({
  selector: 'app-insert-returnprovider',
  templateUrl: './insert-returnprovider.component.html',
  styleUrls: ['./insert-returnprovider.component.scss']
})
export class InsertReturnproviderComponent implements OnInit {
  constructor(
    private _formBuilder: FormBuilder,
    private providerService:ProviderService,
    private toastr: ToastrService,
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

  invoiceInfo: InvoiceInfo;
  searchForm: FormGroup;
  returnForm: FormGroup;
  contentSale: InvoiceContentInfo[];
  contentToReturn: InvoiceContentInfo[]=[];
  selected: InvoiceContentInfo;
  reasons: ReasonReturnProvider[];
  ListReturneds: ReturnProductProviderInfo[];
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
    var response = await this.providerService.getReasonReturn().toPromise();
    if (response) {
      this.reasons = response;
      this.returnForm.get('reasonID').setValue(this.reasons[0].reasonID);
    } else {
      this.toastr.error('Fallo al cargar razones', 'Error');
    }
  }

  getReturneds() {
    this.providerService.getListReturneds(this.invoiceInfo.invoiceID).subscribe(request=>
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

  onCheckboxChange(e,item:InvoiceContentInfo)
  {
    //checked
    if(e.currentTarget.checked)
    {
      this.checks.push(e);
      let valid=false;
      this.selected = item;
      if (this.Validando) 
      {
        let index = this.contentSale.findIndex(d=>d.contentID==this.selected.contentID);
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
      let index = this.contentToReturn.findIndex(d=>d.contentID==item.contentID);
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
          let valQuant = this.Validando.find(d=>d.idProd==element.contentID);
          if(!this.contentToReturn.find(d=>d.contentID==element.contentID))
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
          let valQuant = this.Validando.find(d=>d.idProd==element.contentID);
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
      let request = await this.providerService.getAnInvoiceByID(this.searchForm.get('searchID').value).toPromise();
      if(request)
      {
        this.invoiceInfo = request;
        await this.getContentSale(this.invoiceInfo.invoiceID);
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
    var response = await this.providerService.getContentInvoiceByID(id).toPromise();
    if (response.length > 0) {
      this.contentSale = response;
    }
  }

  validationInputInvoice(field: string): boolean {
    return this.searchForm.get(field).errors != undefined;
  }


  async return() {
    let request : InsertReturnProviderRequest[]=[];
    let i = 0;
    while(i<this.contentToReturn.length)
    {
      let item = new InsertReturnProviderRequest();
      item.contentID=this.contentToReturn[i].contentID;
      item.quantity=this.t.controls[i].get('quantity').value;
      item.reasonID=this.t.controls[i].get('reasonID').value;
      request.push(item);
      i++;
    }
    var response = await this.providerService.newReturn(request).toPromise();
    if (response) 
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

  asignValuesToNewReturned(request: InsertReturnProviderRequest[]) {
    let i = 0;
    while (i<request.length)
    {
      let prod = new ReturnProductProviderInfo();
      prod.contentID = request[i].contentID;
      prod.productName = this.contentToReturn[i].productName + ' ' + this.contentToReturn[i].model;
      prod.registerDate = new Date();
      prod.invoiceID = this.invoiceInfo.invoiceID;
      prod.quantity=request[i].quantity;
      prod.amount = this.t.controls[i].get('totalPrice').value;
      let reason = this.reasons.find((d) => d.reasonID == request[i].reasonID);
      prod.descriptReason = reason.description;
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
    this.checkallControl!=null ? this.checkallControl.target.checked=false : false;
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
        let index = this.contentSale.findIndex(d=>d.contentID==this.contentToReturn[i].contentID);
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

  addReason() {
    let modal = this.modalService.open(UpdateReasonreturnclientComponent, {
      centered: true,
    });

    modal.componentInstance.title = 'Agregar razón de devolución';
    modal.componentInstance.reasonList = this.reasons;
    modal.componentInstance.ModalNum = 2;

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
        validando.idProd=element.contentID;
        let prodReturned = this.ListReturneds.filter(d=>d.contentID==validando.idProd);
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

  calcAmount(p,x)
  {
    return parseFloat((p*x).toFixed(2));
  }
  reset()
  {
    this.returnForm.reset();
    this.historial=false;
    this.invoiceInfo=null;
    this.ListReturneds=null;
    this.selected=null;
    this.contentSale=null;
    this.dynamicForm.reset();
    this.t.reset();
    this.existReturned=false;
    this.Validando=null;
  }
}
