import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'clients',
    loadChildren: () =>
      import('./site/client-components/client-components.module').then(
        (m) => m.ClientComponentsModule
      ),
  },
  { path: 'home', loadChildren: () => import('./site/home-components/home-components.module').then(m => m.HomeComponentsModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
