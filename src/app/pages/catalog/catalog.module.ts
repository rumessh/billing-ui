import {NgModule} from '@angular/core';
import {MaterialModule, MdPaginatorModule, MdInputModule, MdButtonModule, MdTableModule, MdPaginator, PageEvent, MdAutocompleteModule } from '@angular/material';
import {PageUtil} from '../../shared/page-util/page-util';
import {SideNavModule} from '../../shared/sidenav/sidenav';
import {CdkTableModule} from '@angular/cdk';
import {HttpModule} from '@angular/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import {RouterModule} from '@angular/router';

import {CatalogDataService} from './catalog-data/catalog-data';
import {ProductList} from './product-list/product-list';
import {CategoryCreate} from './category-create/category-create';
import {ProductCreate} from './product-create/product-create';

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
      CommonModule,
      RouterModule,
      MdAutocompleteModule
    ],
  exports: [ProductList],
  declarations: [ProductList, CategoryCreate, ProductCreate],
  providers: [PageUtil, CatalogDataService]
})
export class CatalogModule {}