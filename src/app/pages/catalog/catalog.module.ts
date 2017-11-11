import {NgModule} from '@angular/core';
import { PageEvent, MatDialogModule } from '@angular/material';
import {PageUtil} from '../../shared/page-util/page-util';
import {SideNavModule} from '../../shared/sidenav/sidenav';
import {CdkTableModule} from '@angular/cdk/table';
import {HttpModule} from '@angular/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import {RouterModule} from '@angular/router';

import {CatalogDataService} from './catalog-data/catalog-data';
import {ProductList} from './product-list/product-list';
import {CategoryCreate} from './category-create/category-create';
import {ProductCreate} from './product-create/product-create';
import {ProductListTable} from './product-list/product-list-table';
import {ProductSearch} from './product-list/product-search';
import {UpdateDialog} from './product-list/update-dialog';
import {BaseMaterialModule} from '../../app.material.module';

@NgModule({
  imports: [
      BaseMaterialModule,    
      SideNavModule,
      CdkTableModule, 
      HttpModule, 
      FormsModule, 
      ReactiveFormsModule,
      CommonModule,
      RouterModule,
      MatDialogModule
    ],
  exports: [ProductList, CategoryCreate, ProductCreate, ProductListTable, ProductSearch],
  declarations: [ProductList, CategoryCreate, ProductCreate, ProductListTable, ProductSearch, UpdateDialog],
  entryComponents: [UpdateDialog],
  providers: [PageUtil, CatalogDataService]
})
export class CatalogModule {}