import {NgModule} from '@angular/core'
import { PageEvent, MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import {PageUtil} from '../../shared/page-util/page-util'
import {OrderCreate} from './order-create/order-create'
import {OrderDataService} from './order-data/order-data'
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import {RouterModule} from '@angular/router';
import {CdkTableModule} from '@angular/cdk/table';
import {CatalogModule} from '../catalog/catalog.module';
import {OrderList} from './order-list/order-list';
import {OrderListTable} from './order-list/order-list-table';
import {OrderDetail} from './order-detail/order-detail';
import { CustomerModule } from '../customer/customer.module';
import { OrderSearch } from './order-list/order-search';
import {BaseMaterialModule} from '../../app.material.module';

@NgModule({
    imports: [
      BaseMaterialModule,
      FormsModule, 
      ReactiveFormsModule,
      CommonModule,
      RouterModule,
      CdkTableModule,
      CatalogModule,
      MatDatepickerModule,
      MatNativeDateModule,
      CustomerModule
    ],
    exports: [OrderSearch],
    declarations: [OrderCreate, OrderList, OrderListTable, OrderDetail, OrderSearch],
    providers: [PageUtil, OrderDataService]
})
export class OrderModule {}