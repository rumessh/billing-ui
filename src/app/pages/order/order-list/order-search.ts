import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Order, OrderDataService } from '../order-data/order-data';

@Component({
    selector: 'order-search',
    styleUrls: ['order-search.scss'],
    templateUrl: "order-search.html"
})
export class OrderSearch {
    @Input() customerUuid: String;    
    @Output() orderSearched = new EventEmitter<Order>();

    constructor(private orderDataService: OrderDataService,
        private formBuilder: FormBuilder) {
        this.buildOrderSearchForm();
        this.bindValueChanges();
    }

    searchOrderForm: FormGroup;
    orderSuggestionList: Order[];

    orderSelected(selectedOrder: Order) {
        this.orderSearched.emit(selectedOrder);
    }

    buildOrderSearchForm() {
        this.searchOrderForm = this.formBuilder.group({
            orderNumber: ''
        });
    }

    bindValueChanges() {
        this.searchOrderForm.get('orderNumber').valueChanges
            .debounceTime(400)
            .subscribe(name => {
                if(typeof name === 'string') {
                    this.orderDataService.searchOrder(this.searchOrderForm.get('orderNumber').value, this.customerUuid)
                    .then((orderList) => this.orderSuggestionList = orderList);
                }
            });
    }
    orderAutoDisplay(order: Order) {
        return order ? order.orderNumber : order;
    }
}