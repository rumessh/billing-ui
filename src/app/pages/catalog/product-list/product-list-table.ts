import { Component, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MdPaginatorModule, MdInputModule, MdTableModule, MdPaginator, MdDialog, MdDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { UpdateDialog } from './update-dialog';

import { CatalogDataService, Product, Totals } from '../catalog-data/catalog-data';


@Component({
    selector: 'product-list-table',
    styleUrls: ['product-list-table.scss'],
    templateUrl: 'product-list-table.html',
})
export class ProductListTable implements OnChanges {
    @Input() displayedColumns: String[];
    @Input() isSearched: boolean;
    @Input() searchData: Product[];
    @Input() isPaginated: boolean;
    @Input() isFilterRequired: boolean;
    @Input() isTemproraryDelete: boolean;
    @Input() overallDiscount: number;
    dataSource: ProductDataSource | null;
    totalEstimatedPrice: number;

    constructor(private cd: ChangeDetectorRef,
        private catalogDataService: CatalogDataService,
        public dialog: MdDialog) { }

    @ViewChild(MdPaginator) paginator: MdPaginator;
    @ViewChild("filter") filter: ElementRef;

    ngAfterViewInit() {
        this.dataSource = new ProductDataSource(this.paginator, this.catalogDataService, this.isSearched, this.searchData);
        setTimeout(() => this.cd.markForCheck());
    }

    ngOnChanges(changes: SimpleChanges) {
        for (let propName in changes) {
            if (propName === 'searchData') {
                this.dataSource = new ProductDataSource(this.paginator, this.catalogDataService, this.isSearched, this.searchData);
                break;
            }
            else if(propName === 'overallDiscount') {
                this.dataSource.totals.totalDiscount = this.dataSource.totals.totalDiscount + this.overallDiscount;
            }
        }
    }

    onPaginateChange(event) {
        this.dataSource = new ProductDataSource(this.paginator, this.catalogDataService, this.isSearched, this.searchData);
    }

    getSearchData(): Product[] {
        return this.searchData;
    }

    updateQuantity(row: Product) {
        let dialogRef = this.dialog.open(UpdateDialog);
        dialogRef.componentInstance.previousValue = row.quantityRequested;
        dialogRef.componentInstance.title = 'Update Quantity';
        dialogRef.afterClosed().subscribe(result => {
            result ? row.quantityRequested = parseInt(result, 10) : row.quantityRequested;
            result ? row.invoicedQuantity = parseInt(result, 10) : row.invoicedQuantity;
            this.dataSource.updateTotals();
        });
    }

    updateDiscount(row: Product) {
        let dialogRef = this.dialog.open(UpdateDialog);
        dialogRef.componentInstance.previousValue = row.discount;
        dialogRef.componentInstance.title = 'Update Discount';
        dialogRef.afterClosed().subscribe(result => {
            result ? row.discount = parseInt(result, 10) : row.discount;
            this.dataSource.updateTotals();
        }); 
    }

    deleteProduct(row: Product) {
        if (this.isTemproraryDelete) {
            for (let i = 0; i < this.searchData.length; i++) {
                if (this.searchData[i].productUuid === row.productUuid) {
                    this.searchData.splice(i, 1);
                }
            }
            this.dataSource = new ProductDataSource(this.paginator, this.catalogDataService, this.isSearched, this.searchData);
        }
        else {
            //TODO: Handle server side product delete.
        }
    }
}

export class ProductDataSource extends DataSource<any> {

    totals: Totals = {};

    constructor(private _paginator: MdPaginator,
        private catalogDataService: CatalogDataService,
        private isSearched: boolean,
        private searchData: Product[]) {
        super();
    }

    connect(): Observable<any[]> {
        if (this.isSearched) {
            this.updateTotals();
            return Observable.of(this.searchData);
        }
        else {
            const start = this._paginator.pageIndex * this._paginator.pageSize;
            const size = this._paginator.pageSize;
            return this.catalogDataService.getProductPagenated(start, size);
        }
    }

    updateTotals() {

        this.totals = {
            totalAmount: 0,
            totalDiscount: 0,
            totalItems: 0,
            totalTax: 0,
            overAllDiscount: 0
        };

        this.totals = this.searchData.length > 0 ? this.searchData.reduce((totals: Totals, product) => {
            let itemTotal = product['unitPrice'] * product['quantityRequested'];
            let itemTax = product['taxAmount'] = product['taxPercentage'] * itemTotal / 100;
            let itemDiscount = product['discount'] = product['discount'] ? product['discount'] : 0;
            product['itemTotal'] = itemTax + itemTotal;

            totals.totalDiscount = totals.totalDiscount + itemDiscount;            
            totals.totalTax = totals.totalTax + itemTax;
            totals.totalAmount = totals.totalAmount + itemTotal + totals.totalTax - totals.totalDiscount;
            return totals;
        }, this.totals) : this.totals;
    }

    addOverAllDiscount(overAllDiscount: number) {
        this.totals.overAllDiscount = overAllDiscount;
        this.totals.totalDiscount += overAllDiscount;
        this.totals.totalAmount -= overAllDiscount;
    }
    
    disconnect() { }
}