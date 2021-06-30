import { Component, OnInit } from '@angular/core';
import { PaginationListResponse } from 'src/app/site/core/models/pagination-list-response';
import { ProductInfo } from '../../../models/productInfo';
import { ProductService } from '../../../services/product.service';
import * as Feather from 'feather-icons';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  products: PaginationListResponse<ProductInfo> | undefined;

  page: number = 1;

  statusUsers?: boolean = undefined;

  constructor(
    private productService: ProductService,
    // private router: Router,
    private toastr: ToastrService,
    // private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    Feather.replace();

    this.getProducts();
    this.initSiganR();
    // moment().locale('es');
  }

  getProducts() {
    this.productService.getProducts().subscribe(
      (response) => {
        this.products = response;
      },
      (error) => {}
    );
  }


  initSiganR() {
    let connection = new HubConnectionBuilder()
      .withUrl(`${environment.url_base}Products`)
      .build();

    connection.on('NewProduct', (data) => {
      let product = data as ProductInfo;
      
      this.products.data.unshift(product);

      this.toastr.info(product.productName,"Nuevo producto registrado.");
    });

    connection.start().then();
  }


  // pageChange(page: any) {
  //   this.productService
  //     .getProductsByPage((page - 1) * this.products.pageSize)
  //     .subscribe((response) => {
  //       this.products = response;
  //     });
  // }

 
}
