import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
    OrderModule
  ],
  providers: [PageUtil, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
