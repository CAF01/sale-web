import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PaginationListResponse } from 'src/app/site/core/models/pagination-list-response';
import { ProductInfo } from '../../../models/productInfo';
import { ProductService } from '../../../services/product.service';
import * as Feather from 'feather-icons';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { SetStatusProductRequest } from '../../../models/setstatusproductrequest';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertModalComponent } from 'src/app/site/shared-components/alert-modal/alert-modal.component';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.scss']
})
export class AllProductsComponent implements OnInit {
  products: PaginationListResponse<ProductInfo> | undefined;

  page: number = 1;

  statusUsers?: boolean = undefined;

  constructor(
    private productService: ProductService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    Feather.replace();

    this.getProducts();
    this.initSiganR();
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

  edit(product: ProductInfo) {
    this.router.navigate(['home/products/update-product'], {
      queryParams: { product: JSON.stringify(product) },
      skipLocationChange: true, //skip location para ocultar el json de la URL
    });
  }

  pageChange(page: any) {
    this.productService
      .getProductsByPage((page - 1) * this.products.pageSize)
      .subscribe((response) => {
        this.products = response;
      });
  }

  SetStatusProd(product: ProductInfo, stat: boolean) {
    const RequestUpdateStatus = new SetStatusProductRequest();
    RequestUpdateStatus.productID = product.productID;
    RequestUpdateStatus.status = stat;
    this.productService.setStatusProduct(RequestUpdateStatus).subscribe(
      (response) => {
        product.status = stat;
        if (product.status)
          this.toastr.success('¡Restauración realizada!','Producto restaurado correctamente');
        else 
          this.toastr.success('¡Eliminado!','Producto eliminado correctamente');
      },
      (error) => console.log(error)
    );
  }

  DelSelected(product: ProductInfo) {
    let modal = this.modalService.open(AlertModalComponent, { centered: true });

    modal.componentInstance.title = 'Confirmar eliminación de producto';
    modal.componentInstance.message =
      '¿Desea eliminar a ' + product.productName + ' - ' + product.description + '?';

    modal.result
      .then((result) => {
        if (result) {
          this.SetStatusProd(product, false);
        }
      })
      .catch((err) => {});
  }

  RestoreProduct(product: ProductInfo) {
    let modal = this.modalService.open(AlertModalComponent, { centered: true });

    modal.componentInstance.title = 'Restaurarión de producto';
    modal.componentInstance.message =
      '¿Desea restaurar ' +  product.productName + ' - ' + product.description + '?';

    modal.result
      .then((result) => {
        if (result) {
          this.SetStatusProd(product, true);
        }
      })
      .catch((err) => {});
  }
}
