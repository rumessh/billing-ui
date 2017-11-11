import {Component} from '@angular/core';
import {ProductListTable} from './product-list-table';
import {ProductSearch} from './product-search';

import {Product} from '../catalog-data/catalog-data';

@Component({
  selector: 'product-list',
  styleUrls: ['product-list.scss'],
  templateUrl: 'product-list.html',
})
export class ProductList {
  constructor() {};
  displayedColumns = ['edit', 'name', 'hsnCode', 'productNumber', 'categoryName', 'unitPrice', 'onHandQuantity'];
  isPaginated = true;
  isSearched = false;
  isFilterRequired = true;
  productList: Product[] = [];

  searchedProducts(productList: Product[]) {
    this.productList = productList;
    this.isSearched = true;
  }
}