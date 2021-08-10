import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ValidateForm } from 'src/app/site/core/helpers/validate-formfields-helper';
import { PaginationListResponse } from 'src/app/site/core/models/pagination-list-response';
import { BrandInfo } from '../../../models/entitys/brandinfo';
import { brandInsertRequest } from '../../../models/request/brandinsertrequest';
import { CatalogService } from '../../../services/catalog.service';

@Component({
  selector: 'app-insert-brand',
  templateUrl: './insert-brand.component.html',
  styleUrls: ['./insert-brand.component.scss']
})
export class InsertBrandComponent implements OnInit {
  @Input() title:string;
  @Input() message?:string;
  @Input() brandList: PaginationListResponse<BrandInfo>;


  constructor(public modal: NgbActiveModal,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private catalogService : CatalogService) {}

  brandForm : FormGroup;

  formSubmitAttempt : boolean=true;
  newBrand:brandInsertRequest;

  validateForm = ValidateForm;

  ngOnInit(): void {
    this.SetValidatorCategory();
  }

  Insert()
  {
    if(this.brandForm.valid)
    {
      this.newBrand=this.brandForm.value;
      this.catalogService.inserBrand(this.newBrand).subscribe(request=>
        {
          var newAddedBrand = new BrandInfo();
          newAddedBrand.brandID=request;
          newAddedBrand.name=this.newBrand.name;
          newAddedBrand.status=true;
          this.brandList.data.push(newAddedBrand);
          this.toastr.success('Nueva marca agregada','¡Correcto!');
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

  SetValidatorCategory() {
    this.brandForm = this._formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ])
    });

  }

  validationInput(field: string): boolean {
    return this.brandForm.get(field).errors != undefined;
  }
}

