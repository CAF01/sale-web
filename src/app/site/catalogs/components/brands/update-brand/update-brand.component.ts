import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ValidateForm } from 'src/app/site/core/helpers/validate-formfields-helper';
import { BrandInfo } from '../../../models/entitys/brandinfo';
import { brandUpdateRequest } from '../../../models/request/brandupdaterequest';
import { DeleteRequest } from '../../../models/request/deleteRequest';
import { CatalogService } from '../../../services/catalog.service';

@Component({
  selector: 'app-update-brand',
  templateUrl: './update-brand.component.html',
  styleUrls: ['./update-brand.component.scss']
})
export class UpdateBrandComponent implements OnInit {
  @Input() title:string;
  @Input() message?:string;
  @Input() brand : BrandInfo;


  file: File=undefined;


  constructor(public modal: NgbActiveModal,private _formBuilder: FormBuilder,private toastr: ToastrService,private catalogService : CatalogService) {}

  brandForm : FormGroup;

  formSubmitAttempt : boolean=true;
  updatedBrand:brandUpdateRequest;

  validateForm = ValidateForm;

  ngOnInit(): void {
    this.SetValidatorsBrands();
  }

  async SaveChanges()
  {
    if(this.brandForm.valid)
    {
      this.updatedBrand=this.brandForm.value;
      this.updatedBrand.brandID=this.brand.brandID;
      if(this.file)
      {
        if(this.brand.imageUrl)
        {
          var delet : DeleteRequest;
          delet = new DeleteRequest();
          delet.publicID=this.brand.imageUrl
          this.catalogService.deletePhoto(delet).subscribe(req=>console.log(req),error=>console.log(error));
        }
        
        this.updatedBrand.imageUrl=await this.uploadFile(this.file);
        this.brand.imageUrl=this.updatedBrand.imageUrl;
      }
      this.catalogService.updateBrand(this.updatedBrand).subscribe(request=>
        {
          this.toastr.success('Marca actualizada','¡Correcto!');
          this.brand.name=this.updatedBrand.name;
          this.modal.close(true);
        },
        error=>
        {
          console.log(error);
        })
      
    }
    else
    {
      this.validateForm.validateAllFormFields(this.brandForm);
      this.formSubmitAttempt=false;
    }
    
  }

  SetValidatorsBrands() {
    this.brandForm = this._formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      imageUrl: new FormControl('', [
        Validators.maxLength(185)
      ]),
    });
    this.brandForm.get('name').setValue(this.brand.name);
    this.brandForm.get('imageUrl').setValue(this.brand.imageUrl);
  }

  validationInput(field: string): boolean {
    return this.brandForm.get(field).errors != undefined;
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
}