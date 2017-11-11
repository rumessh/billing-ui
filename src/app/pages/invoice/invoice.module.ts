import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceCreate } from './invoice-create/invoice-create';
import { InvoiceDataService } from './invoice-data/invoice-data';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CatalogModule} from '../catalog/catalog.module';
import {CustomerModule} from '../customer/customer.module';
import { OrderModule } from '../order/order-module';
import {BaseMaterialModule} from '../../app.material.module';

@NgModule({
  imports: [
    BaseMaterialModule,
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    CatalogModule,
    CustomerModule,
    OrderModule
  ],
  declarations: [InvoiceCreate],
  providers: [InvoiceDataService]
})
export class InvoiceModule { }