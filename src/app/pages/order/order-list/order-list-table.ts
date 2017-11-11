import { Component, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatPaginator, MatDialog, MatDialogRef, PageEvent } from '@angular/material';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { OrderDataService, Order } from '../order-data/order-data';
import { PageUtil } from '../../../shared/page-util/page-util';


@Component({
    selector: 'order-list-table',
    styleUrls: ['order-list-table.scss'],
    templateUrl: 'order-list-table.html',
})
export class OrderListTable implements OnChanges {
    @Input() displayedColumns: String[];
    @Input() isSearched: boolean;
    @Input() searchData: Order[];
    @Input() isPaginated: boolean;
    @Input() isFilterRequired: boolean;
    dataSource: OrderDataSource | null;
    pageEvent: PageEvent;

    constructor(private cd: ChangeDetectorRef,
        private orderDataService: OrderDataService,
        public dialog: MatDialog,
        public pageUtil: PageUtil) { }

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild("filter") filter: ElementRef;

    ngAfterViewInit() {
        this.dataSource = new OrderDataSource(this.paginator, this.orderDataService, this.isSearched, this.searchData);
        setTimeout(() => this.cd.markForCheck());
    }

    ngOnChanges(changes: SimpleChanges) {
        for (let propName in changes) {
            if (propName === 'searchData') {
                this.dataSource = new OrderDataSource(this.paginator, this.orderDataService, this.isSearched, this.searchData);
                break;
            }
        }
    }

    onPaginateChange(event) {
        this.dataSource = new OrderDataSource(this.paginator, this.orderDataService, this.isSearched, this.searchData);
    }

    getSearchData(): Order[] {
        return this.searchData;
    }

    deleteOrder(event, row: Order) {
        event.stopPropagation();
        alert("Row delete clicked");
        //TODO: Handle server side order delete.

    }
}

export class OrderDataSource extends DataSource<any> {
    constructor(private _paginator: MatPaginator,
        private orderDataService: OrderDataService,
        private isSearched: boolean,
        private searchData: Order[]) {
        super();
    }

    connect(): Observable<any[]> {
        if (this.isSearched) {
            return Observable.of(this.searchData);
        }
        else {
            const start = this._paginator.pageIndex * this._paginator.pageSize;
            const size = this._paginator.pageSize;
            return this.orderDataService.getOrderPagenated(start, size);
        }
    }

    disconnect() { }
}