import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MdInputModule, MdButtonModule } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Customer, CustomerDataService } from '../customer-data/customer-data';

@Component({
    selector: 'customer-search',
    styleUrls: ['customer-search.scss'],
    templateUrl: "customer-search.html"
})
export class CustomerSearch {
    @Output() customerSearched = new EventEmitter<Customer>();

    constructor(private customerDataService: CustomerDataService,
        private formBuilder: FormBuilder) {
        this.buildCustomerSearchForm();
        this.bindValueChanges();
    }

    searchCustomerForm: FormGroup;
    customerSuggestionList: Customer[];

    customerSelected(selectedCustomer: Customer) {
        this.customerSearched.emit(selectedCustomer);
    }

    buildCustomerSearchForm() {
        this.searchCustomerForm = this.formBuilder.group({
            customerName: ''
        });
    }

    bindValueChanges() {
        this.searchCustomerForm.get('customerName').valueChanges
            .debounceTime(400)
            .subscribe(name => {
                if(typeof name === 'string') {
                    this.customerDataService.searchCustomer(this.searchCustomerForm.get('customerName').value)
                    .then((customerList) => this.customerSuggestionList = customerList);
                }
            });
    }
    customerAutoDisplay(customer: Customer) {
        return customer ? customer.name : customer;
    }
}