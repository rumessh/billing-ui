import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import {RouterModule} from '@angular/router';
import {AppRoutes} from './routes';

import { AppComponent } from './app.component';
import {HomepageModule} from './pages/homepage/homepage';
import {PageUtil} from './shared/page-util/page-util';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {CustomerModule} from './pages/customer/customer.module';
import {CatalogModule} from './pages/catalog/catalog.module';
import {OrderModule} from './pages/order/order-module';
import {AuthService} from './shared/auth-service/auth-service';
import { InvoiceModule } from './pages/invoice/invoice.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(AppRoutes),
    HomepageModule,
    CustomerModule,
    CatalogModule,
    OrderModule,
    InvoiceModule
  ],
  providers: [PageUtil, AuthService, {provide: LOCALE_ID, useValue: 'en-IN'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
