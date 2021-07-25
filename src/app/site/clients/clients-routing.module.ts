import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GetClientsComponent } from './components/clients/get-clients/get-clients.component';
import { InsertClientComponent } from './components/clients/insert-client/insert-client.component';
import { UpdateClientComponent } from './components/clients/update-client/update-client.component';
import { GetReturnsComponent } from './components/returnclients/get-returns/get-returns.component';
import { InsertReturnComponent } from './components/returnclients/insert-return/insert-return.component';

const routes: Routes = [
  { path: 'insert-client', component: InsertClientComponent },
  { path: 'list', component: GetClientsComponent },
  { path: 'update',component:UpdateClientComponent},
  { path: 'new-return',component:InsertReturnComponent},
  { path:'historial-returns',component:GetReturnsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientsRoutingModule {}
