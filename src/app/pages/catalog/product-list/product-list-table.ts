import { Component, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatPaginator, MatDialog, MatDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/of';
import { UpdateDialog } from './update-dialog';

import { CatalogDataService, Product, Totals } from '../catalog-data/catalog-data';
import { PageUtil } from '../../../shared/page-util/page-util';

@Component({
    selector: 'product-list-table',
    styleUrls: ['product-list-table.scss'],
    templateUrl: 'product-list-table.html',
})
export class ProductListTable implements OnChanges {
    @Input() displayedColumns: String[];
    @Input() isSearched: boolean;
    @Input() set searchData(searchData: Product[]) {
        this.productDataObservable.next(searchData);
    }
    get searchData() {
        return this.productDataObservable.getValue();
    }
    @Input() isPaginated: boolean;
    @Input() isFilterRequired: boolean;
    @Input() isTemproraryDelete: boolean;
    @Input() overallDiscount: number;
    @Input() isTotalsNeeded:boolean = true;
    @Input() isInvoiceScreen:boolean = false;
    dataSource: ProductDataSource | null;
    totalEstimatedPrice: number;
    productDataObservable: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);

    constructor(private cd: ChangeDetectorRef,
        private catalogDataService: CatalogDataService,
        public dialog: MatDialog,
        public pageUtil: PageUtil) { }

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild("filter") filter: ElementRef;

    ngOnInit() {
        this.dataSource = new ProductDataSource(this.paginator, this.catalogDataService, this.isSearched, this.productDataObservable, this.isInvoiceScreen);
        this.productDataObservable.subscribe(() => this.dataSource.updateTotals());
    }

    ngAfterViewInit() {
        /** Not a search flow. Make service call to get paginated products */
        if(!this.isSearched) {
            this.onPaginateChange(this.paginator.pageIndex, this.paginator.pageSize)
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        for (let propName in changes) {
            if(propName === 'overallDiscount') {
                this.dataSource.totals.totalDiscount = this.dataSource.totals.totalDiscount + this.overallDiscount;
            }
        }
    }

    onPaginateChange(pageIndex, pageSize) {
        const start = pageIndex * pageSize;
        this.catalogDataService.getProductPagenated(start, pageSize).subscribe(productList => {
            this.productDataObservable.next(productList);
        });
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
            this.productDataObservable.next(this.searchData);
        }
        else {
            //TODO: Handle server side product delete.
        }
    }
}

export class ProductDataSource extends DataSource<any> {

    totals: Totals = {};

    constructor(private _paginator: MatPaginator,
        private catalogDataService: CatalogDataService,
        private isSearched: boolean,
        private productDataObservable: BehaviorSubject<Product[]>,
        private isInvoiceScreen: boolean) {
        super();
    }

    connect(): Observable<any[]> {
        return this.productDataObservable;
    }

    updateTotals() {

        this.totals = {
            totalAmount: 0,
            totalDiscount: 0,
            totalItems: 0,
            totalTax: 0,
            overAllDiscount: 0
        };

        this.totals = this.productDataObservable.getValue().length > 0 ? this.productDataObservable.getValue().reduce((totals: Totals, product) => {
            let totalItem = this.isInvoiceScreen ? product['invoicedQuantity'] : product['quantityRequested']
            let itemTotal = product['itemTotal']  = product['unitPrice'] * totalItem;
            let itemTax = product['taxAmount'] = product['taxPercentage'] * itemTotal / 100;
            let itemDiscount = product['discount'] = product['discount'] ? product['discount'] : 0;

            totals.totalDiscount = totals.totalDiscount + itemDiscount;            
            totals.totalTax = totals.totalTax + itemTax;
            totals.totalAmount = totals.totalAmount + itemTotal;
            return totals;
        }, this.totals) : this.totals;
    }

    addOverAllDiscount(overAllDiscount: number) {
        this.totals.overAllDiscount = overAllDiscount;
        this.totals.totalDiscount += overAllDiscount;
        this.totals.totalAmount -= overAllDiscount;
    }

    setIsSearched(isSearched : boolean){
        this.isSearched = isSearched;
    }
    
    disconnect() { }
}