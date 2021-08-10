import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BrandInfo } from 'src/app/site/catalogs/models/entitys/brandinfo';
import { CategoryInfo } from 'src/app/site/catalogs/models/entitys/categoryinfo';
import { CatalogService } from 'src/app/site/catalogs/services/catalog.service';
import { ValidateForm } from 'src/app/site/core/helpers/validate-formfields-helper';
import { PaginationListResponse } from 'src/app/site/core/models/pagination-list-response';
import * as Feather from 'feather-icons';
import { InsertProductRequest } from '../../../models/insertproductrequest';
import { ProductService } from '../../../services/product.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { InsertCategoryComponent } from 'src/app/site/catalogs/components/categories/insert-category/insert-category.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InsertBrandComponent } from 'src/app/site/catalogs/components/brands/insert-brand/insert-brand.component';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss'],
})
export class NewProductComponent implements OnInit {
  brands: PaginationListResponse<BrandInfo> | undefined;
  categories: PaginationListResponse<CategoryInfo> | undefined;

  ValidatedForm: boolean;
  productForm: FormGroup;
  validateForm = ValidateForm;

  imageUrl: string;

  file: File;

  product: InsertProductRequest;

  constructor(
    private catalogService: CatalogService,
    private _formBuilder: FormBuilder,
    private productService: ProductService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    Feather.replace();
    this.ValidatedForm = true;
    this.getBrands();
    this.getCategories();
    this.SetValidatorProduct();

  }

  onSubmit() {
    if (this.productForm.valid) {
      if(this.file)
        this.uploadFile(this.file);
      this.ValidatedForm = true;
      this.product = this.productForm.value;
      this.product.ImageUrl = this.imageUrl;
      this.productService.newProduct(this.product).subscribe(
        (request) => {
          this.toastr.success('Nuevo producto agregado', '¡Correcto!');
          this.imageUrl = undefined;
          this.productForm.reset();
          this.file = undefined;
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.ValidatedForm = false;
      this.validateForm.validateAllFormFields(this.productForm);
    }
  }

  keepFile(file: File): void {
    this.file = file;
  }

  uploadFile(file: File): void {
    if (file) {
      var formData = new FormData();
      formData.append('File', file, file.name);
      this.productService.Upload(formData).subscribe(
        (request) => {
          this.imageUrl = request;
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  addCategory() {
    let modal = this.modalService.open(InsertCategoryComponent, {
      centered: true,
    });

    modal.componentInstance.title = 'Insertar nueva categoria';
    modal.componentInstance.categoryList = this.categories;

    modal.result
      .then((result) => {
        if (result) 
        {
          this.productForm.get('CategoryID').setValue(this.categories.data[this.categories.data.length-1].categoryID);
        }
      })
      .catch((err) => {});
  }
  addBrand() {
    let modal = this.modalService.open(InsertBrandComponent, {
      centered: true,
    });

    modal.componentInstance.title = 'Insertar nueva Marca';
    modal.componentInstance.brandList = this.brands;

    modal.result
      .then((result) => {
        if (result) {
          this.productForm.get('BrandID').setValue(this.brands.data[this.brands.data.length-1].brandID);
        }
      })
      .catch((err) => {});
  }

  async getBrands() {
    var response = await this.catalogService.getBrands().toPromise();
    if(response.data)
    {
      this.brands=response;
      this.productForm.get('BrandID').setValue(this.brands.data[0].brandID);
    }
  }

  async getCategories() {
    var response = await this.catalogService.getCategories().toPromise();
    if(response.data)
    {
      this.categories=response;
      this.productForm.get('CategoryID').setValue(this.categories.data[0].categoryID);
    }
  }

  validationInput(field: string): boolean {
    return this.productForm.get(field).errors != undefined;
  }

  SetValidatorProduct() {
    this.productForm = this._formBuilder.group({
      ProductName: new FormControl('', [
        Validators.required,
        Validators.maxLength(75),
      ]),
      Description: new FormControl('', [
        Validators.required,
        Validators.maxLength(150),
      ]),
      Code: new FormControl('', [
        Validators.required,
        Validators.maxLength(25),
      ]),
      CategoryID: new FormControl('', [Validators.required, Validators.min(1)]),
      Model: new FormControl('', [Validators.maxLength(50)]),
      BrandID: new FormControl('', [Validators.required, Validators.min(1)]),
      MinForWholeSale: new FormControl('', []),
      PricePerWholeSale: new FormControl('', []),
      NormalPrice: new FormControl('', [
        Validators.required,
      ]),
      MinStock: new FormControl('', [
        Validators.pattern(/^[0-9]+$/),
        // Validators.min(1),
      ]),
      MaxStock: new FormControl('', [
        Validators.pattern(/^[0-9]+$/),
        // Validators.min(1),
      ]),
    });
  }

}
