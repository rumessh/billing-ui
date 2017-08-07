import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Order, OrderDataService } from '../order-data/order-data';
import { Location } from '@angular/common';
import { MdInputModule, MdButtonModule, MdSnackBar, DateAdapter } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Customer, CustomerDataService } from '../../customer/customer-data/customer-data';
import { Product } from '../../catalog/catalog-data/catalog-data';
import { ProductListTable } from '../../catalog/product-list/product-list-table';

import { AuthService } from '../../../shared/auth-service/auth-service';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'order-create',
  templateUrl: 'order-create.html',
  styleUrls: ['order-create.scss'],
})
export class OrderCreate {

  createOrderForm: FormGroup;
  customer: Customer;
  orderedProductList: Product[] = [];
  displayedColumns = ['delete', 'name', 'quantityRequested', 'hsnCode', 'productNumber', 'unitPrice'];
  isSearched = true;
  isPaginated = false;
  isFilterRequired = false;
  totalEstimatedPrice: number;

  @ViewChild(ProductListTable)
  private productListTable: ProductListTable;

  constructor(
    private formBuilder: FormBuilder,
    private orderDataService: OrderDataService,
    private location: Location,
    private snackbar: MdSnackBar,
    route: ActivatedRoute,
    private customerDataService: CustomerDataService,
    private authService: AuthService,
    private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('in');
    let customerId;
    route.parent.params.subscribe((params) => {
      customerId = params.id
    });

    this.buildCreateOrderForm(customerId);
  }

  buildCreateOrderForm(customerId: String) {

    this.createOrderForm = this.formBuilder.group({
      neededByDate: ['', Validators.required],
      customer: [{ value: '', disabled: true }, Validators.required],
      category: [''],
      productName: [''],
      orderNotes: ['']
    });

    this.customerDataService.getCustomerData(customerId)
      .then((customer) => {
        this.createOrderForm.get('customer').setValue(customer.name);
        this.customer = customer;
      });

  }

  productAdded(addedProduct: Product) {
    this.orderedProductList = [...this.orderedProductList, addedProduct];
  }

  onSubmit() {
    const order = this.prepareSaveOrder();
    this.orderDataService.createOrder(order).then(() => {
      let snackbarRef = this.snackbar.open('Order created successfully', 'Done');
      snackbarRef.afterDismissed().subscribe(() => {
        this.goBack();
      });
    });
  }

  prepareSaveOrder(): Order {
    const formModel = this.createOrderForm.value;

    const order: Order = {
      neededByDate: formModel.neededByDate,
      userUuid: 'b6d6eea0-7a5c-11e7-8718-d9a4a860e55c',
      customerUuid: this.customer.customerUuid,
      status: 'OPEN',
      orgUuid: this.authService.getOrgUuid(),
      orderNotes: formModel.notes,
      orderLineItems: this.orderedProductList
    };

    return order;
  }

  revert() {
    this.createOrderForm.reset();
  }

  goBack() {
    this.location.back();
  }

}
