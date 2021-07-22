import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GetContentInvoiceComponent } from './components/invoice/get-content-invoice/get-content-invoice.component';
import { GetInvoiceComponent } from './components/invoice/get-invoice/get-invoice.component';
import { InsertInvoiceComponent } from './components/invoice/insert-invoice/insert-invoice.component';
import { GetProvidersComponent } from './components/providers/get-providers/get-providers.component';
import { InsertProviderComponent } from './components/providers/insert-provider/insert-provider.component';
import { UpdateProviderComponent } from './components/providers/update-provider/update-provider.component';
import { GetReturnproviderComponent } from './components/return-provider/get-returnprovider/get-returnprovider.component';
import { InsertReturnproviderComponent } from './components/return-provider/insert-returnprovider/insert-returnprovider.component';
// import { ProvidersComponent } from './providers.component';

const routes: Routes = [
  {
    path: 'new-provider',
    component: InsertProviderComponent /*, component: ProvidersComponent*/,
  },
  {
    path: 'list',
    component: GetProvidersComponent,
  },
  {
    path: 'update-provider',
    component: UpdateProviderComponent,
  },
  {
    path: 'new-invoice',
    component: InsertInvoiceComponent,
  },
  {
    path: 'list-invoice',
    component: GetInvoiceComponent,
  },
  {
    path: 'content-invoice',
    component: GetContentInvoiceComponent,
  },
  {
    path:'insert-return',
    component:InsertReturnproviderComponent
  },
  {
    path:'historial-returns',
    component:GetReturnproviderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProvidersRoutingModule {}
