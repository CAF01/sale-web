import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsRoutingModule } from './products-routing.module';
import { ListComponent } from './components/products/list/list.component';
import { NewProductComponent } from './components/products/new-product/new-product.component';
import { UpdateProductComponent } from './components/products/update-product/update-product.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { MomentModule } from 'ngx-moment';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { NgxCurrencyModule } from 'ngx-currency';


@NgModule({
  declarations: [
    ListComponent,
    NewProductComponent,
    UpdateProductComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    SharedComponentsModule,
    MomentModule,
    NgbPaginationModule,
    NgxCurrencyModule
  ]
})
export class ProductsModule { }
