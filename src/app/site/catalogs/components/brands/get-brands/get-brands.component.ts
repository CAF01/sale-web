import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as Feather from 'feather-icons';
import { ToastrService } from 'ngx-toastr';
import { ValidateForm } from 'src/app/site/core/helpers/validate-formfields-helper';
import { PaginationListResponse } from 'src/app/site/core/models/pagination-list-response';
import { AlertModalComponent } from 'src/app/site/shared-components/alert-modal/alert-modal.component';
import { BrandInfo } from '../../../models/entitys/brandinfo';
import { brandInsertRequest } from '../../../models/request/brandinsertrequest';
import { brandSetStatusRequest } from '../../../models/request/brandsetstatusrequest';
import { CatalogService } from '../../../services/catalog.service';
import { UpdateBrandComponent } from '../update-brand/update-brand.component';

@Component({
  selector: 'app-get-brands',
  templateUrl: './get-brands.component.html',
  styleUrls: ['./get-brands.component.scss']
})
export class GetBrandsComponent implements OnInit {

  brandList : PaginationListResponse<BrandInfo> | undefined;
  formSubmitAttempt: boolean;

  brandForm : FormGroup;
  brand : brandInsertRequest;

  imageUrl:string;

  file: File;

  statusBrands?:boolean=true;

  validateForm = ValidateForm;
  constructor(private modalService: NgbModal,private _formBuilder: FormBuilder,private toastr: ToastrService,private catalogService : CatalogService) {}

  ngOnInit(): void {
    Feather.replace();

    this.formSubmitAttempt=true;
    this.getBrands();
    this.SetValidatorsBrands();
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

 async onSubmit()
  {
    if(this.brandForm.valid)
    {
     
      this.formSubmitAttempt=true;
      this.brand=this.brandForm.value;
      this.brand.ImageUrl=await this.uploadFile(this.file);
      this.catalogService.inserBrand(this.brand).subscribe(request=>
      {
        this.toastr.success('Nueva marca agregada','¡Correcto!');
        this.file=null;

       let newBrand=  new BrandInfo();
       newBrand.brandID=request;
       newBrand.name=this.brand.name;
       newBrand.status=true;
       newBrand.imageUrl= this.brand.ImageUrl;
        this.brandList.data.push(newBrand);
      },
      error=>
      {
        console.log(error);
      });
      this.brandForm.reset();
      //se actualiza la lista
    }
    else
    {
      this.validateForm.validateAllFormFields(this.brandForm);
      this.formSubmitAttempt = false;
    }
  }

  getBrands()
  {
    this.catalogService.getBrands().subscribe(request=>
      {
        this.brandList=request;
      },error=>
      {
        console.log(error);
      });
  }

  keepFile(file:File):void
  {
    this.file=file;

  }

  async uploadFile(file: File){
    if(file)
    {
      var formData = new FormData();
      formData.append('File',file,file.name);
      let url=  await  this.catalogService.Upload(formData).toPromise();
      return url;
    }
    return null;
  }

  del(brand:BrandInfo)
  {
    let modal = this.modalService.open(AlertModalComponent, { centered: true });

    modal.componentInstance.title = 'Confirmar eliminación de marca';
    modal.componentInstance.message =
      '¿Desea eliminar ' + brand.name  + '?';

    modal.result
      .then((result) => {
        if (result) {
          this.SetStatusBrand(brand, false);
        }
      })
      .catch((err) => {});
  }

  SelectBrand(brand:BrandInfo)
  {
    let modal = this.modalService.open(UpdateBrandComponent, { centered: true });

    modal.componentInstance.title = 'Actualizar información de marca';
    modal.componentInstance.brand=brand;

    modal.result
      .then((result) => {
        if (result) {
          // this.SetStatusBrand(brand, false);
        }
      })
      .catch((err) => {});
  }

  SetStatusBrand(brand: BrandInfo, stat: boolean) {
    const RequestDelete = new brandSetStatusRequest();
    RequestDelete.brandID = brand.brandID;
    RequestDelete.Status = stat;
    this.catalogService.deleteBrand(RequestDelete).subscribe(
      (response) => {
        brand.status = stat;
        if (brand.status)
          this.toastr.success(
            'Marca activada correctamente',
            '¡Correcto!'
          );
        else 
        {
          this.toastr.success('Marca deshabilitada correctamente','¡Eliminación!');
        }
      },
      (error) => console.log(error)
    );
  }

  RestoreBrand(brand: BrandInfo) {
    let modal = this.modalService.open(AlertModalComponent, { centered: true });

    modal.componentInstance.title = 'Restauración de marca';
    modal.componentInstance.message =
      '¿Desea activar: ' + brand.name +'?';

    modal.result
      .then((result) => {
        if (result) {
          this.SetStatusBrand(brand, true);
        }
      })
      .catch((err) => {});
  }

  validationInput(field: string): boolean {
    return this.brandForm.get(field).errors != undefined;
  }

  SetValidatorsBrands() {
    this.brandForm = this._formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
    });
  }

}
