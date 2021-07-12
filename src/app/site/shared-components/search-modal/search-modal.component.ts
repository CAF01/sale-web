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
  // @Input() title: string;
  // @Input() message?: string;
  @Input() products?: Array<ProductInfo>;
  active = 1;
  matchesC:number=0;
  matchesN:number=0;
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

  listResponseCode: Array<ProductInfo>;
  listResponseName: Array<ProductInfo>;

  validateForm = ValidateForm;

  SetValidatorSearch() {
    this.searchForm = this._formBuilder.group({
      searchingCode: new FormControl('', [Validators.required,Validators.maxLength(25)]),
      searchingName: new FormControl('', [Validators.required,Validators.maxLength(75)])
    });
  }

  validationInputInvoice(field: string): boolean {
    return this.searchForm.get(field).errors != undefined;
  }

  bringResult(i:number)
  {
    if(this.active==1)
      this.products.push(this.listResponseCode[i]);
    else
      this.products.push(this.listResponseName[i]);
    this.modal.close(true)
  }



  searchName()
  {
    let cad:string = this.searchForm.get('searchingName').value;
    if(cad.length>=4)
    {
      let req = new GetProductRequest();
        req.productName = cad;
        this.productService.getProductByName(req).subscribe((request) => {
          this.listResponseName= new Array<ProductInfo>();
          this.listResponseName=request;
          this.matchesN=this.listResponseName.length;
        },error=>
        {
          this.matchesN=0;
        });
    }
    else
    {
      this.listResponseName=undefined;
      this.matchesN=0;
    }
  }
}
