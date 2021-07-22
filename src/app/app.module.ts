import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastrModule, ToastNoAnimation, ToastNoAnimationModule } from 'ngx-toastr';
import { InterceptorService } from './site/core/services/interceptor.service';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './site/home-components/home/home.component';
import { SharedComponentsModule } from './site/shared-components/shared-components.module';
import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from './site/home-components/dashboard/dashboard.component';
import { ChartsModule } from 'ng2-charts';
import { MomentModule } from 'ngx-moment';
// import { NgxCurrencyModule } from 'ngx-currency';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent
  ],
  imports: [
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ToastNoAnimationModule.forRoot(),
    SharedComponentsModule,
    ChartsModule,
    MomentModule


    // NgxCurrencyModule
    ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true} 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
