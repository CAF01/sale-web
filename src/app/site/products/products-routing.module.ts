import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllProductsComponent } from './components/products/all-products/all-products.component';
import { ListComponent } from './components/products/list/list.component';
import { NewProductComponent } from './components/products/new-product/new-product.component';
import { UpdateProductComponent } from './components/products/update-product/update-product.component';

const routes: Routes = [
  { 
    path: 'stock', 
    component: ListComponent 
  },
  {
    path: 'new-product',
    component: NewProductComponent,
  },
  {
    path:'update-product',
    component:UpdateProductComponent
  },
  {
    path:'all-product',
    component:AllProductsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
