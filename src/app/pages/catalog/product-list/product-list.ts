import {Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef} from '@angular/core';
import {MdPaginatorModule, MdInputModule, MdButtonModule, MdTableModule, MdPaginator, PageEvent } from '@angular/material';
import {DataSource} from '@angular/cdk';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import {CatalogDataService} from '../catalog-data/catalog-data';

@Component({
  selector: 'product-list',
  styleUrls: ['product-list.scss'],
  templateUrl: 'product-list.html',
})
export class ProductList {
  constructor(private cd: ChangeDetectorRef,
              private catalogDataService: CatalogDataService) { }
  displayedColumns = ['name', 'hsnCode', 'productNumber', 'categoryName', 'unitPrice', 'onHandQuantity'];
  dataSource: ProductDataSource | null;

  @ViewChild(MdPaginator) paginator: MdPaginator;
  @ViewChild("filter") filter: ElementRef;



  ngOnInit() {
    this.dataSource = new ProductDataSource(this.paginator, this.catalogDataService);
    setTimeout(() => this.cd.markForCheck());
    /* Observable.fromEvent(this.filter.nativeElement, 'keyup')
        .debounceTime(150)
        .distinctUntilChanged()
        .subscribe(() => {
          if (!this.dataSource) { return; }
          this.dataSource.filter = this.filter.nativeElement.value;
        }); */
  }

  onPaginateChange(event){
      this.dataSource = new ProductDataSource(this.paginator, this.catalogDataService);
  }
}

export class ProductDataSource extends DataSource<any> {
  constructor(private _paginator: MdPaginator,
              private catalogDataService: CatalogDataService) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    const start = this._paginator.pageIndex * this._paginator.pageSize;
    const size = this._paginator.pageSize;
    return this.catalogDataService.getProductPagenated(start, size);
  }

  disconnect() {}
}