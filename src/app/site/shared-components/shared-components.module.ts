import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsRoutingModule } from './shared-components-routing.module';
import { FieldErrorDisplayComponentComponent } from './field-error-display-component/field-error-display-component.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DisplayLottieComponent } from './display-lottie/display-lottie.component';
// import { LottieModule } from 'ngx-lottie';
// import player from 'lottie-web';
import { AlertModalComponent } from './alert-modal/alert-modal.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { SearchModalComponent } from './search-modal/search-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PaySaleModalComponent } from './pay-sale-modal/pay-sale-modal.component';
import { NgxCurrencyModule } from 'ngx-currency';
import { HistorialPaymentModalComponent } from './historial-payment-modal/historial-payment-modal.component';
import { SearchProductsComponent } from './search-products/search-products.component';
import { SearchClientComponent } from './search-client/search-client.component';
import { CalendarComponent } from './calendar/calendar.component';



// export function playerFactory()
// {
//   return player;
// }


@NgModule({
  declarations: [
    FieldErrorDisplayComponentComponent,
    DisplayLottieComponent,
    AlertModalComponent,
    FileUploadComponent,
    SearchModalComponent,
    PaySaleModalComponent,
    HistorialPaymentModalComponent,
    SearchProductsComponent,
    SearchClientComponent,
    CalendarComponent,
  ],
  imports: [
    CommonModule,
    SharedComponentsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    // LottieModule.forRoot({player:playerFactory}),
    NgbModule,
    NgxCurrencyModule
    
  ],
  exports:[
    FieldErrorDisplayComponentComponent,
    FormsModule,
    ReactiveFormsModule,
    // DisplayLottieComponent,
    AlertModalComponent,
    FileUploadComponent,
    NgbModule,
    SearchProductsComponent,
    SearchClientComponent,
    CalendarComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedComponentsModule { }
