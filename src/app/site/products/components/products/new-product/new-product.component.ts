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

  imageUrl:string;

  file: File;

  product: InsertProductRequest;

  constructor(
    private catalogService: CatalogService,
    private _formBuilder: FormBuilder,
    private productService: ProductService,
    private toastr : ToastrService
  ) {}

  ngOnInit(): void {
    Feather.replace();
    this.ValidatedForm = true;
    this.getBrands();
    this.getCategories();
    this.SetValidatorProduct();
  }

  onSubmit() 
  {
    if (this.productForm.valid) 
    {
      this.uploadFile(this.file);
      this.ValidatedForm = true;
      this.product = this.productForm.value;
      this.product.ImageUrl=this.imageUrl;
      this.productService.newProduct(this.product).subscribe(
        (request) => {
          this.toastr.success('Nuevo producto agregado','¡Correcto!');
          this.imageUrl=undefined;
          this.productForm.reset();
          this.file=undefined;

        },
        (error) => {
          console.log(error);
        }
      );
    } 
    else 
    {
      this.ValidatedForm = false;
      this.validateForm.validateAllFormFields(this.productForm);
    }
  }

  keepFile(file:File):void
  {
    this.file=file;
  }

  uploadFile(file: File): void {
    if(file)
    {
      var formData = new FormData();
      formData.append('File',file,file.name);
      this.productService.Upload(formData).subscribe(request=>
        {
          this.imageUrl=request;
        },(error=>
        {
          console.log(error);
        }));
    }
  }

  getBrands() {
    this.catalogService.getBrands().subscribe(
      (request) => {
        this.brands = request;

        this.productForm.get('BrandID').setValue(this.brands.data[0].brandID);
      },
      (error) => {
        console.log(error.statusText);
      }
    );
  }

  getCategories() {
    this.catalogService.getCategories().subscribe(
      (request) => {
        this.categories = request;

        this.productForm
          .get('CategoryID')
          .setValue(this.categories.data[0].categoryID);
      },
      (error) => {
        console.log(error.statusText);
      }
    );
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
      MinForWholeSale: new FormControl('', [Validators.min(1)]),
      PricePerWholeSale: new FormControl('', [
        Validators.pattern(/^(\d+(\.\d{0,2})?|\.?\d{1,2})$/),
      ]),
      NormalPrice: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(\d+(\.\d{0,2})?|\.?\d{1,2})$/),
      ]),
      MinStock: new FormControl('', [Validators.pattern(/^[0-9]+$/)]),
      MaxStock: new FormControl('', [Validators.pattern(/^[0-9]+$/)]),
    });
  }
}
