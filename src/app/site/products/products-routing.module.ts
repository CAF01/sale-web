import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './components/products/list/list.component';
import { NewProductComponent } from './components/products/new-product/new-product.component';
import { UpdateProductComponent } from './components/products/update-product/update-product.component';

const routes: Routes = [
  { path: 'list', component: ListComponent },
  {
    path: 'new-product',
    component: NewProductComponent,
  },
  {
    path:'update-product',
    component:UpdateProductComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
