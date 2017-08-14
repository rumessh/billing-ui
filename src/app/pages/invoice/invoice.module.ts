import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceCreate } from './invoice-create/invoice-create';
import { InvoiceDataService } from './invoice-data/invoice-data';
import {MaterialModule, MdPaginatorModule, MdInputModule, MdButtonModule, MdTableModule, MdAutocompleteModule, MdDatepickerModule, MdNativeDateModule, MdTooltipModule } from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CatalogModule} from '../catalog/catalog.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    MdPaginatorModule,
    MdInputModule,
    MdButtonModule,
    MdTableModule,
    MdAutocompleteModule,
    MdDatepickerModule,
    MdNativeDateModule,
    MdTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    CatalogModule
  ],
  declarations: [InvoiceCreate],
  providers: [InvoiceDataService]
})
export class InvoiceModule { }