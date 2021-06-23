import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PaginationListResponse } from 'src/app/site/core/models/pagination-list-response';
import { CatalogService } from '../../../services/catalog.service';
import * as Feather from 'feather-icons';
import { ValidateForm } from 'src/app/site/core/helpers/validate-formfields-helper';
import { CategoryInfo } from '../../../models/entitys/categoryinfo';
import { categoryInsertRequest } from '../../../models/request/categoryinsertrequest';
import { AlertModalComponent } from 'src/app/site/shared-components/alert-modal/alert-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { categorySetStatusRequest } from '../../../models/request/categorysetstatusrequest';
import { UpdateCategoryComponent } from '../update-category/update-category.component';

@Component({
  selector: 'app-get-categories',
  templateUrl: './get-categories.component.html',
  styleUrls: ['./get-categories.component.scss'],
})
export class GetCategoriesComponent implements OnInit {
  categoryList: PaginationListResponse<CategoryInfo> | undefined;
  formSubmitAttempt: boolean;

  categoryForm: FormGroup;
  category: categoryInsertRequest;

  validateForm = ValidateForm;
  statusBrands?: boolean=true;
  
  constructor(
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private catalogService: CatalogService,
    private modalService : NgbModal
  ) {}

  ngOnInit(): void {
    Feather.replace();
    this.formSubmitAttempt = true;
    this.getCategories();
    this.SetValidatorsCategories();
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      this.formSubmitAttempt = true;
      this.category = this.categoryForm.value;
      this.catalogService.insertCategory(this.category).subscribe(
        (request) => {
          this.toastr.success('Nueva categoria agregada','¡Correcto!');
          let newCategory = new CategoryInfo();
          newCategory.categoryID=request;
          newCategory.description=this.category.description;
          newCategory.status=true;
          this.categoryList.data.push(newCategory);
        },
        (error) => {
          console.log(error);
        }
      );
      this.categoryForm.reset();
    } else {
      this.validateForm.validateAllFormFields(this.categoryForm);
      this.formSubmitAttempt = false;
    }
  }

  SelectCategory(category:CategoryInfo)
  {
    let modal = this.modalService.open(UpdateCategoryComponent, { centered: true });

    modal.componentInstance.title = 'Actualizar información de categoria';
    modal.componentInstance.category=category;

    modal.result
      .then((result) => {
        if (result) {
        }
      })
      .catch((err) => {});
  }

  getCategories() {
    this.catalogService.getCategories().subscribe(
      (request) => {
        this.categoryList = request;
      },
      (error) => {
        console.log(error);
      }
    );
  }


  del(category:CategoryInfo)
  {
    let modal = this.modalService.open(AlertModalComponent, { centered: true });

    modal.componentInstance.title = 'Confirmar eliminación de categoria';
    modal.componentInstance.message =
      '¿Desea eliminar ' + category.description  + '?';

    modal.result
      .then((result) => {
        if (result) {
          this.SetStatusBrand(category, false);
        }
      })
      .catch((err) => {});
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

  SetStatusBrand(category: CategoryInfo, stat: boolean) {
    const RequestDelete = new categorySetStatusRequest();
    RequestDelete.categoryID = category.categoryID;
    RequestDelete.status = stat;
    this.catalogService.deleteCategory(RequestDelete).subscribe(
      (response) => {
        category.status = stat;
        if (category.status)
          this.toastr.success(
            'Categoria activada correctamente',
            '¡Correcto!'
          );
        else 
        {
          this.toastr.success('Categoria deshabilitada correctamente','¡Eliminación!');
        }
      },
      (error) => console.log(error)
    );
  }

  RestoreCategory(category: CategoryInfo) {
    let modal = this.modalService.open(AlertModalComponent, { centered: true });

    modal.componentInstance.title = 'Restauración de marca';
    modal.componentInstance.message =
      '¿Desea activar: ' + category.description +'?';

    modal.result
      .then((result) => {
        if (result) {
          this.SetStatusBrand(category, true);
        }
      })
      .catch((err) => {});
  }

  validationInput(field: string): boolean {
    return this.categoryForm.get(field).errors != undefined;
  }

  SetValidatorsCategories() {
    this.categoryForm = this._formBuilder.group({
      description: new FormControl('', [
        Validators.required,
        Validators.maxLength(75),
      ])
    });
  }
}
