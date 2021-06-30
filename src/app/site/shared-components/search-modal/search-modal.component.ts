import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidateForm } from '../../core/helpers/validate-formfields-helper';
import { PaginationListResponse } from '../../core/models/pagination-list-response';
import { ProductInfo } from '../../products/models/productInfo';
import { ProductService } from '../../products/services/product.service';
import { GetProductRequest } from '../../providers/models/request/getproductrequest';

@Component({
  selector: 'app-search-modal',
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.scss'],
})
export class SearchModalComponent implements OnInit {
  @Input() numModal: number = 0;
  @Input() title: string;
  @Input() message?: string;
  @Input() products?: Array<ProductInfo>;

  constructor(
    public modal: NgbActiveModal,
    private _formBuilder: FormBuilder,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.SetValidatorSearch();
  }

  submitAttempt: boolean = true;
  searchForm: FormGroup;

  listResponse: Array<ProductInfo>;

  validateForm = ValidateForm;

  SetValidatorSearch() {
    this.searchForm = this._formBuilder.group({
      searching: new FormControl('', [Validators.required]),
      result:new FormControl('',[])
    });
  }

  searchInfo() {
    if (this.searchForm.valid) 
    {
      this.submitAttempt = true;
      if (this.numModal == 0) 
      {
        //ByName-Product
        let req = new GetProductRequest();
        req.productName = this.searchForm.get('searching').value;

        this.productService.getProductByName(req).subscribe((request) => {

          this.CreateArrayProducts(request);
        },error=>console.log(error));
      }
      if (this.numModal == 1) 
      {
        //ByCode-Product
        let req = new GetProductRequest();
        req.code = this.searchForm.get('searching').value;

        this.productService.getProductByCode(req).subscribe((request) => {

          this.CreateArrayProducts(request);

        },error=>console.log(error));
      }
    } 
    else 
    {
      this.validateForm.validateAllFormFields(this.searchForm);
      this.submitAttempt = false;
    }
  }

  CreateArrayProducts(response: PaginationListResponse<ProductInfo>) {
    this.listResponse = new Array<ProductInfo>();
    var zero = 0;
    while (response[zero]) 
    {
      this.listResponse.push(response[zero]);
      zero++;
    }
    this.searchForm.get('result').setValue(0);
  }

  validationInputInvoice(field: string): boolean {
    return this.searchForm.get(field).errors != undefined;
  }

  bringResult()
  {
    if(this.numModal==0 || this.numModal==1)
    {
      this.products.push(this.listResponse[this.searchForm.get('result').value]);
    }
    this.modal.close(true)
  }
}
