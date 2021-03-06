import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Order, OrderDataService } from '../order-data/order-data';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../catalog/catalog-data/catalog-data';
import { ProductListTable } from '../../catalog/product-list/product-list-table';

import { AuthService } from '../../../shared/auth-service/auth-service';
import * as moment from 'moment';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
    selector: 'order-detail',
    templateUrl: 'order-detail.html',
    styleUrls: ['order-detail.scss'],
})
export class OrderDetail {

    detailOrderForm: FormGroup;
    displayedColumns = ['delete', 'name', 'quantityRequested', 'unitPrice', 'onHandQuantity', 'hsnCode'];
    isSearched = true;
    isPaginated = false;
    isFilterRequired = false;
    orderDetail: Order = {} as any;

    @ViewChild(ProductListTable)
    private productListTable: ProductListTable;

    constructor(
        private formBuilder: FormBuilder,
        private orderDataService: OrderDataService,
        private location: Location,
        private snackbar: MatSnackBar,
        route: ActivatedRoute,
        private authService: AuthService) {
        let orderUuid;
        route.params.subscribe((params) => {
            orderUuid = params.orderId
        });

        this.buildOrderDetailForm(orderUuid);
    }

    buildOrderDetailForm(orderUuid: String) {

        this.detailOrderForm = this.formBuilder.group({
            neededByDate: [new Date(), Validators.required],
            customer: [{ value: '', disabled: true }, Validators.required],
            orderNotes: ['']
        });

        this.orderDataService.getOrderByUuid(orderUuid)
            .then((order) => {
                this.orderDetail = order;
                this.detailOrderForm.get('customer').setValue(order.customer.name);
                this.detailOrderForm.get('neededByDate').setValue(moment(order.neededByDate, 'DD/MM/yyyy').toDate())
            });

    }

    productAdded(addedProduct: Product) {
        this.orderDetail.orderLineItems = [...this.orderDetail.orderLineItems , addedProduct];
    }

    onSubmit() {
        const order = this.prepareSaveOrder();
        /* this.orderDataService.detailOrder(order).then(() => {
            let snackbarRef = this.snackbar.open('Order updated successfully', 'Done');
            snackbarRef.afterDismissed().subscribe(() => {
                this.goBack();
            });
        }); */
    }

    prepareSaveOrder(): Order {
        const formModel = this.detailOrderForm.value;

        const order: Order = {
            neededByDate: formModel.neededByDate,
            userUuid: 'b6d6eea0-7a5c-11e7-8718-d9a4a860e55c',
            customerUuid: this.orderDetail.customer.customerUuid,
            status: 'OPEN',
            orgUuid: this.authService.getOrgUuid(),
            orderNotes: formModel.notes,
            orderLineItems: this.orderDetail.orderLineItems
        };

        return order;
    }

    revert() {
        this.detailOrderForm.reset();
    }

    goBack() {
        this.location.back();
    }

}
