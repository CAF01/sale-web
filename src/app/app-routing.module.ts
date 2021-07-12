import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardServiceService } from './site/core/services/auth-guard-service.service';
import { HomeComponent } from './site/home-components/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: '/home/dash', pathMatch: 'full' },/*/home/users*/
  // { path: 'user', loadChildren: () => import('./site/user-components/user-components.module').then(m => m.UserComponentsModule) },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuardServiceService],
    children: [
      {
        path:'dash',
        loadChildren:()=>
        import('./site/home-components/home-components.module').then((m)=>m.HomeComponentsModule),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./site/users/users.module').then((m) => m.UsersModule),
      },
      {
        path: 'providers',
        loadChildren: () =>
          import('./site/providers/providers.module').then(
            (m) => m.ProvidersModule
          ),
      },
      {
        path: 'clients',
        loadChildren: () =>
          import('./site/clients/clients.module').then((m) => m.ClientsModule),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./site/products/products.module').then(
            (m) => m.ProductsModule
          ),
      },
      {
        path: 'catalogs',
        loadChildren: () =>
          import('./site/catalogs/catalogs.module').then(
            (m) => m.CatalogsModule
          ),
      },
      {
        path:'sales',
        loadChildren:()=>
        import('./site/sales/sales.module').then((m)=>m.SalesModule),
      }
    ],
  },
  // {
  //   path: 'catalogs',
  //   loadChildren: () =>
  //     import('./site/catalogs/catalogs.module').then((m) => m.CatalogsModule),
  // },
  // {
  //   path: 'clients',
  //   loadChildren: () =>
  //     import('./site/clients/clients.module').then((m) => m.ClientsModule),
  // },
  // {
  //   path: 'providers',
  //   loadChildren: () =>
  //     import('./site/providers/providers.module').then(
  //       (m) => m.ProvidersModule
  //     ),
  // },
  // {
  //   path: 'sales',
  //   loadChildren: () =>
  //     import('./site/sales/sales.module').then((m) => m.SalesModule),
  // },
  // {
  //   path: 'shared-components',
  //   loadChildren: () =>
  //     import('./site/shared-components/shared-components.module').then(
  //       (m) => m.SharedComponentsModule
  //     ),
  // },
  // {
  //   path: 'products',
  //   loadChildren: () =>
  //     import('./site/products/products.module').then((m) => m.ProductsModule),
  // },
  {
    path: 'account',
    loadChildren: () =>
      import('./site/account/account.module').then((m) => m.AccountModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
