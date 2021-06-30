import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BrandInfo } from 'src/app/site/catalogs/models/entitys/brandinfo';
import { CategoryInfo } from 'src/app/site/catalogs/models/entitys/categoryinfo';
import { CatalogService } from 'src/app/site/catalogs/services/catalog.service';
import { PaginationListResponse } from 'src/app/site/core/models/pagination-list-response';
import { ProductService } from '../../../services/product.service';
import * as Feather from 'feather-icons';
import { ValidateForm } from 'src/app/site/core/helpers/validate-formfields-helper';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductInfo } from '../../../models/productInfo';
import { UpdateProductRequest } from '../../../models/updateproductrequest';
import { DeleteRequest } from 'src/app/site/catalogs/models/request/deleteRequest';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss']
})
export class UpdateProductComponent implements OnInit{
  brands: PaginationListResponse<BrandInfo> | undefined;
  categories: PaginationListResponse<CategoryInfo> | undefined;

  ValidatedForm: boolean;
  productForm: FormGroup;
  validateForm = ValidateForm;

  ReceivedProd:ProductInfo;
  prodID:number;

  imageUrl: string;

  file: File;
  deletedPhoto:boolean =false;

  updateProductRequest : UpdateProductRequest;

  constructor(
    private catalogService: CatalogService,
    private _formBuilder: FormBuilder,
    private productService: ProductService,
    private toastr: ToastrService,
    private _route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    Feather.replace();
    this.ValidatedForm = true;
    this._route.queryParams.subscribe((params) => {
      if (params.product) {
        this.ReceivedProd = JSON.parse(params.product) as ProductInfo;
        this.prodID=this.ReceivedProd.productID;
        this.imageUrl=this.ReceivedProd.imageUrl;
        this.SetValidatorProduct();
        this.getBrands();
        this.getCategories();
        this.setFormValues();
      }
    });

  }

  async onSubmit() {
    if (this.productForm.valid) {
      if(this.file)
        await this.uploadFile(this.file);
      if((this.file && this.ReceivedProd.imageUrl) || (this.deletedPhoto&&this.ReceivedProd.imageUrl))
      {
        let deletep = new DeleteRequest();
        deletep.publicID=this.ReceivedProd.imageUrl;
        this.productService.deletePhoto(deletep).subscribe();
        if(this.deletedPhoto)
          this.imageUrl=null;
      }
      this.ValidatedForm = true;
      this.updateProductRequest=this.productForm.value;
      this.updateProductRequest.productID=this.ReceivedProd.productID;
      this.updateProductRequest.imageUrl=this.imageUrl;
      this.productService.updateProduct(this.updateProductRequest).subscribe(request=>
        {
          this.toastr.success('Producto Actualizado', '¡Correcto!');
          this.router.navigate(['home/products/all-product']);      
        },
        error=>
        {
          console.log(error);
        });
    } 
    else 
    {
      this.ValidatedForm = false;
      this.validateForm.validateAllFormFields(this.productForm);
    }
  }

  keepFile(file: File): void {
    this.file = file;
  }

  async uploadFile(file: File){
    if (file) {
      var formData = new FormData();
      formData.append('File', file, file.name);
      var response = await this.productService.Upload(formData).toPromise();
      this.imageUrl = response;
    }
  }

  async getBrands() {
    var response = await this.catalogService.getBrands().toPromise();
    if(response.data)
    {
      this.brands=response;
      let positionBrand = this.brands.data.findIndex(d=>d.name==this.ReceivedProd.marca);
      this.productForm.get('BrandID').setValue(this.brands.data[positionBrand].brandID);
    }
  }

  async getCategories() {
    var response = await this.catalogService.getCategories().toPromise();
    if(response.data)
    {
      this.categories=response;
      let positionCategory = this.categories.data.findIndex(d=>d.description==this.ReceivedProd.categoria);
      this.productForm.get('CategoryID').setValue(this.categories.data[positionCategory].categoryID);
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
        Validators.min(0.10)
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

  setFormValues()
  {
    this.productForm.get('ProductName').setValue(this.ReceivedProd.productName);
    this.productForm.get('Description').setValue(this.ReceivedProd.description);
    this.productForm.get('Code').setValue(this.ReceivedProd.code);
    this.productForm.get('Model').setValue(this.ReceivedProd.model);
    this.productForm.get('MinForWholeSale').setValue(this.ReceivedProd.minForWholeSale);
    this.productForm.get('PricePerWholeSale').setValue(this.ReceivedProd.pricePerWholeSale);
    this.productForm.get('NormalPrice').setValue(this.ReceivedProd.normalPrice);
    this.productForm.get('MinStock').setValue(this.ReceivedProd.minstock);
    this.productForm.get('MaxStock').setValue(this.ReceivedProd.maxstock);
  }

  deletePhoto()
  {
    this.deletedPhoto=true;
  }
  restorePhoto()
  {
    this.deletedPhoto=false;
  }

}

