import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsRoutingModule } from './shared-components-routing.module';
import { FieldErrorDisplayComponentComponent } from './field-error-display-component/field-error-display-component.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    FieldErrorDisplayComponentComponent
  ],
  imports: [
    CommonModule,
    SharedComponentsRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[
    FieldErrorDisplayComponentComponent,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedComponentsModule { }
