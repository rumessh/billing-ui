import {NgModule} from '@angular/core';
import {
  MaterialModule, 
  MdPaginatorModule, 
  MdInputModule, 
  MdButtonModule, 
  MdTableModule, 
  MdPaginator, 
  PageEvent, 
  MdExpansionModule 
} from '@angular/material';
import {PageUtil} from '../../shared/page-util/page-util';
import {SideNavModule} from '../../shared/sidenav/sidenav';
import {CdkTableModule} from '@angular/cdk/table';
import {HttpModule} from '@angular/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';  

import {CustomerDataService} from './customer-data/customer-data';
import {CustomerList} from './customer-list/customer-list';
import {CustomerSearch} from './customer-list/customer-search';
import {CustomerCreate} from './customer-create/customer-create';

@NgModule({
  imports: [
      MaterialModule,
      MdButtonModule, 
      SideNavModule,
      MdTableModule, 
      CdkTableModule, 
      MdPaginatorModule, 
      HttpModule, 
      MdInputModule,
      FormsModule, 
      ReactiveFormsModule,
      CommonModule
    ],
  exports: [CustomerList, CustomerCreate, CustomerSearch],
  declarations: [CustomerList, CustomerCreate, CustomerSearch],
  providers: [PageUtil, CustomerDataService]
})
export class CustomerModule {}