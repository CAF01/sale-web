import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsRoutingModule } from './shared-components-routing.module';
import { FieldErrorDisplayComponentComponent } from './field-error-display-component/field-error-display-component.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DisplayLottieComponent } from './display-lottie/display-lottie.component';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { AlertModalComponent } from './alert-modal/alert-modal.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { SearchModalComponent } from './search-modal/search-modal.component';


export function playerFactory()
{
  return player;
}



@NgModule({
  declarations: [
    FieldErrorDisplayComponentComponent,
    DisplayLottieComponent,
    AlertModalComponent,
    FileUploadComponent,
    SearchModalComponent
  ],
  imports: [
    CommonModule,
    SharedComponentsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LottieModule.forRoot({player:playerFactory}),
    
  ],
  exports:[
    FieldErrorDisplayComponentComponent,
    FormsModule,
    ReactiveFormsModule,
    DisplayLottieComponent,
    AlertModalComponent,
    FileUploadComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedComponentsModule { }
