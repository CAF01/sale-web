import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './site/home-components/home/home.component';

const routes: Routes = [
  { path: "", redirectTo: "/home/users", pathMatch: "full" },
  // { path: 'user', loadChildren: () => import('./site/user-components/user-components.module').then(m => m.UserComponentsModule) },
  {
    path: 'home',
    component:HomeComponent,
    children: [
      {
        path: 'users',
        loadChildren: () =>
          import('./site/users/users.module').then((m) => m.UsersModule),
      }
    ],
  },
  {
    path: 'catalogs',
    loadChildren: () =>
      import('./site/catalogs/catalogs.module').then((m) => m.CatalogsModule),
  },
  {
    path: 'clients',
    loadChildren: () =>
      import('./site/clients/clients.module').then((m) => m.ClientsModule),
  },
  {
    path: 'providers',
    loadChildren: () =>
      import('./site/providers/providers.module').then(
        (m) => m.ProvidersModule
      ),
  },
  {
    path: 'sales',
    loadChildren: () =>
      import('./site/sales/sales.module').then((m) => m.SalesModule),
  },
  { path: 'shared-components', loadChildren: () => import('./site/shared-components/shared-components.module').then(m => m.SharedComponentsModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
