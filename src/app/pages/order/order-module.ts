import {NgModule} from '@angular/core'
import {MaterialModule, MdPaginatorModule, MdInputModule, MdButtonModule, MdTableModule, MdPaginator, PageEvent, MdAutocompleteModule } from '@angular/material';
import {PageUtil} from '../../shared/page-util/page-util'
import {OrderCreate} from './order-create/order-create'
import {OrderDataService} from './order-data/order-data'
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import {RouterModule} from '@angular/router';
import {CdkTableModule} from '@angular/cdk';
import {CatalogModule} from '../catalog/catalog.module';

@NgModule({
    imports: [
      MaterialModule,
      MdButtonModule, 
      MdTableModule, 
      MdPaginatorModule, 
      MdInputModule,
      FormsModule, 
      ReactiveFormsModule,
      CommonModule,
      RouterModule,
      MdAutocompleteModule,
      CdkTableModule,
      CatalogModule,
    ],
    declarations: [OrderCreate],
    providers: [PageUtil, OrderDataService]
})
export class OrderModule {}