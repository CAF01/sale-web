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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
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
    NgbModule
    ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true} 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
