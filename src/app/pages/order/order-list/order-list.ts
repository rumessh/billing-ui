import {Component} from '@angular/core';
import {OrderListTable} from './order-list-table';

import {Order} from '../order-data/order-data';

@Component({
  selector: 'order-list',
  styleUrls: ['order-list.scss'],
  templateUrl: 'order-list.html',
})
export class OrderList {
  constructor() {};
  displayedColumns = ['delete', 'orderNumber', 'neededByDate', 'status', 'salesPerson', 'createdDate'];
  isSearched = false;
  isFilterRequired = true;  
  orderList: Order[] = [];
}