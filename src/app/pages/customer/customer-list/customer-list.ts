import {Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef} from '@angular/core';
import {MatPaginator, PageEvent } from '@angular/material';
import {DataSource} from '@angular/cdk/table';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import {CustomerDataService} from '../customer-data/customer-data';
import { PageUtil } from '../../../shared/page-util/page-util';

@Component({
  selector: 'customer-list',
  styleUrls: ['customer-list.scss'],
  templateUrl: 'customer-list.html',
})
export class CustomerList {
  constructor(private cd: ChangeDetectorRef,
              private customerDataService: CustomerDataService, public pageUtil: PageUtil) { }
  displayedColumns = ['name', 'phone'];
  dataSource: CustomerDataSource | null;
  pageEvent: PageEvent;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("filter") filter: ElementRef;



  ngOnInit() {
    this.dataSource = new CustomerDataSource(this.paginator, this.customerDataService);
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
      this.dataSource = new CustomerDataSource(this.paginator, this.customerDataService);
  }
}

export class CustomerDataSource extends DataSource<any> {
  constructor(private _paginator: MatPaginator,
              private customerDataService: CustomerDataService) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    const start = this._paginator.pageIndex * this._paginator.pageSize;
    const size = this._paginator.pageSize;
    return this.customerDataService.getCustomerPagenated(start, size);
  }

  disconnect() {}
}