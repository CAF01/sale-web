import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ValidateForm } from 'src/app/site/core/helpers/validate-formfields-helper';
import { PaginationListResponse } from 'src/app/site/core/models/pagination-list-response';
import { CategoryInfo } from '../../../models/entitys/categoryinfo';
import { categoryInsertRequest } from '../../../models/request/categoryinsertrequest';
import { categoryUpdateRequest } from '../../../models/request/categoryupdaterequest';
import { CatalogService } from '../../../services/catalog.service';

@Component({
  selector: 'app-insert-category',
  templateUrl: './insert-category.component.html',
  styleUrls: ['./insert-category.component.scss']
})
export class InsertCategoryComponent implements OnInit {
  @Input() title:string;
  @Input() message?:string;
  @Input() categoryList: PaginationListResponse<CategoryInfo>;


  constructor(public modal: NgbActiveModal,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private catalogService : CatalogService) {}

  categoryForm : FormGroup;

  formSubmitAttempt : boolean=true;
  newCategory:categoryInsertRequest;

  validateForm = ValidateForm;

  ngOnInit(): void {
    this.SetValidatorCategory();
  }

  Insert()
  {
    if(this.categoryForm.valid)
    {
      this.newCategory=this.categoryForm.value;
      this.catalogService.insertCategory(this.newCategory).subscribe(request=>
        {
          var newAddedCategory = new CategoryInfo();
          newAddedCategory.categoryID=request;
          newAddedCategory.description=this.newCategory.description;
          newAddedCategory.status=true;
          this.categoryList.data.push(newAddedCategory);
          this.toastr.success('Nueva categoria añadida','¡Correcto!');
          this.modal.close(true);
        },
        error=>
        {
          console.log(error);
        })
      
    }
    else
    {
      this.validateForm.validateAllFormFields(this.categoryForm);
      this.formSubmitAttempt=false;
    }
    
  }

  SetValidatorCategory() {
    this.categoryForm = this._formBuilder.group({
      description: new FormControl('', [
        Validators.required,
        Validators.maxLength(75),
      ])
    });

  }

  validationInput(field: string): boolean {
    return this.categoryForm.get(field).errors != undefined;
  }
}
