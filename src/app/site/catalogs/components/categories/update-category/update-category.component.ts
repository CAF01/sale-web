import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ValidateForm } from 'src/app/site/core/helpers/validate-formfields-helper';
import { CategoryInfo } from '../../../models/entitys/categoryinfo';
import { categoryUpdateRequest } from '../../../models/request/categoryupdaterequest';
import { CatalogService } from '../../../services/catalog.service';

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.scss']
})
export class UpdateCategoryComponent implements OnInit {
  @Input() title:string;
  @Input() message?:string;
  @Input() category : CategoryInfo;


  constructor(public modal: NgbActiveModal,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private catalogService : CatalogService) {}

  categoryForm : FormGroup;

  formSubmitAttempt : boolean=true;
  updateCategory:categoryUpdateRequest;

  validateForm = ValidateForm;

  ngOnInit(): void {
    this.SetValidatorCategory();
  }

  SaveChanges()
  {
    if(this.categoryForm.valid)
    {
      this.updateCategory=this.categoryForm.value;
      this.updateCategory.categoryID=this.category.categoryID;
      this.catalogService.updateCategory(this.updateCategory).subscribe(request=>
        {
          this.category.description=this.updateCategory.description;
          this.toastr.success('Categoria actualizada','¡Correcto!');
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

    this.categoryForm.get('description').setValue(this.category.description);
  }

  validationInput(field: string): boolean {
    return this.categoryForm.get(field).errors != undefined;
  }
}
