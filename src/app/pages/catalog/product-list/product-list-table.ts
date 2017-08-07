import { Component, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MdPaginatorModule, MdInputModule, MdTableModule, MdPaginator, MdDialog, MdDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { QuantityDialog } from './quantity-dialog';

import { CatalogDataService, Product } from '../catalog-data/catalog-data';


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
        }
    }

    onPaginateChange(event) {
        this.dataSource = new ProductDataSource(this.paginator, this.catalogDataService, this.isSearched, this.searchData);
    }

    getSearchData(): Product[] {
        return this.searchData;
    }

    updateQuantity(row: Product) {
        let dialogRef = this.dialog.open(QuantityDialog);
        dialogRef.componentInstance.previousQuantity = row.quantityRequested;
        dialogRef.afterClosed().subscribe(result => {
            result ? row.quantityRequested = result : row.quantityRequested;
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
    
    totalEstimatedPrice: number;
    
    constructor(private _paginator: MdPaginator,
        private catalogDataService: CatalogDataService,
        private isSearched: boolean,
        private searchData: Product[]) {
        super();
    }

    connect(): Observable<any[]> {
        if (this.isSearched) {
            this.totalEstimatedPrice = this.searchData.length > 0 ? this.searchData.reduce((total, product) => {
                return total + (product['unitPrice'] * product['quantityRequested']);
            }, 0) : 0;
            return Observable.of(this.searchData);
        }
        else {
            const start = this._paginator.pageIndex * this._paginator.pageSize;
            const size = this._paginator.pageSize;
            return this.catalogDataService.getProductPagenated(start, size);
        }
    }

    disconnect() { }
}