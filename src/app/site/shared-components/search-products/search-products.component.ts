import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable, of, OperatorFunction } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  subscribeOn,
  switchMap,
  tap,
} from 'rxjs/operators';
import { ValidateForm } from '../../core/helpers/validate-formfields-helper';
import { ProductInfo } from '../../products/models/productInfo';
import { ProductService } from '../../products/services/product.service';
import { GetProductRequest } from '../../providers/models/request/getproductrequest';

@Component({
  selector: 'app-search-products',
  templateUrl: './search-products.component.html',
  styleUrls: ['./search-products.component.scss'],
})
export class SearchProductsComponent implements OnInit {


  @Output()
  onSubmit = new EventEmitter<ProductInfo>();

  active = 1;

  constructor(
    private _formBuilder: FormBuilder,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.SetValidatorSearch();
  }
  search: string[];
  searching = false;

  submitAttempt: boolean = true;
  searchForm: FormGroup;

  listResponseCode: ProductInfo[] = [];
  listResponseName: ProductInfo[] = [];

  validateForm = ValidateForm;

  SetValidatorSearch() {
    this.searchForm = this._formBuilder.group({
      searchingCode: new FormControl('', [
        Validators.required,
        Validators.maxLength(25),
      ]),
      searchingName: new FormControl('', [
        Validators.required,
        Validators.maxLength(75),
      ]),
    });
  }

  validationInputInvoice(field: string): boolean {
    return this.searchForm.get(field).errors != undefined;
  }


  formatter = (product: ProductInfo) =>
    product ? `${product.productName} - ${product.model} ` : '';

  searchCode: OperatorFunction<string, readonly ProductInfo[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap((term) =>
        this.productService
          .getProductByCode(new GetProductRequest(null, term))
          .pipe(
            tap(() => {}),
            catchError(() => {
              return of([]);
            })
          )
      ),
      tap(() => this.searching = false)
    );

  searchName: OperatorFunction<string, readonly ProductInfo[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap((term) =>
        this.productService
          .getProductByNamePipe(new GetProductRequest(term, null))
          .pipe(
            tap(() => {}),
            catchError(() => {
              return of([]);
            })
          )
      ),
      tap(() => this.searching = false)
    );

    selectedItem($event,input){
      $event.preventDefault();
      input.value = '';
      let prod = $event.item as ProductInfo;
      this.onSubmit.emit(prod);
    }


}
