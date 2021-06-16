import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponentsRoutingModule } from './home-components-routing.module';
import { SharedComponentsModule } from '../shared-components/shared-components.module';






@NgModule({
  declarations: [],
  imports: [CommonModule, HomeComponentsRoutingModule,SharedComponentsModule],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponentsModule {}
