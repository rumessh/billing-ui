import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Order, OrderDataService } from '../../order/order-data/order-data';
import { Location } from '@angular/common';
import { MdInputModule, MdButtonModule, MdSnackBar, DateAdapter } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Customer } from '../../customer/customer-data/customer-data';
import { CustomerSearch } from '../../customer/customer-list/customer-search';
import { Product } from '../../catalog/catalog-data/catalog-data';
import { ProductListTable } from '../../catalog/product-list/product-list-table';
import { Invoice, InvoiceDataService } from '../invoice-data/invoice-data';
import { OrderSearch } from '../../order/order-list/order-search';

import { AuthService } from '../../../shared/auth-service/auth-service';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'invoice-create',
  templateUrl: 'invoice-create.html',
  styleUrls: ['invoice-create.scss'],
})
export class InvoiceCreate {

  createInvoiceForm: FormGroup;
  customer: Customer = {} as any;
  invoicedProductList: Product[] = [];
  displayedColumns = ['delete', 'name', 'invoicedQuantity', 'hsnCode', 'tax', 'discount', 'unitPrice'];
  isSearched = true;
  isPaginated = false;
  isFilterRequired = false;
  totalEstimatedPrice: number;
  order: Order;

  @ViewChild(ProductListTable)
  private productListTable: ProductListTable;

  constructor(
    private formBuilder: FormBuilder,
    private invoiceDataService: InvoiceDataService,
    private location: Location,
    private snackbar: MdSnackBar,
    route: ActivatedRoute,
    private authService: AuthService,
    private orderDataService: OrderDataService) {
    let customerId;
    let orderUuid;
    route.parent.params.subscribe((params) => {
      customerId = params.customerId;
      orderUuid = params.orderId;
    });

    this.buildCreateInvoiceForm(customerId, orderUuid);
  }

  buildCreateInvoiceForm(customerId: String, orderUuid: String) {

    this.createInvoiceForm = this.formBuilder.group({
      invoiceDate: ['', Validators.required],
      customer: [{ value: '', disabled: true }, Validators.required],
      orderNumber: ['', Validators.required],
      discount: [''],
      category: [''],
      productName: [''],
      invoiceNotes: ['']
    });

    /* this.customerDataService.getCustomerData(customerId)
      .then((customer) => {
        this.createInvoiceForm.get('customer').setValue(customer.name);
        this.customer = customer;
      }); */

    /* this.orderDataService.getOrderByUuid(orderUuid)
      .then((order) => {
        this.order = order;
        this.createInvoiceForm.get('orderNumber').setValue(order.orderNumber);
        this.invoicedProductList = order.orderLineItems
                                    .filter(item => (item.onHandQuantity > item.quantityRequested 
                                                      && item.quantityRequested > item.deliveredQuantity));
        this.invoicedProductList.forEach(item => item.invoicedQuantity = item.quantityRequested);                
      }); */

  }

  customerSearched(customer: Customer) {
    this.customer = customer;
  }

  orderSearched(order: Order) {
    this.order = order;
    this.orderDataService.getOrderByUuid(order.orderUuid)
    .then((order) => {
      this.order = order;
      this.createInvoiceForm.get('orderNumber').setValue(order.orderNumber);
      this.invoicedProductList = order.orderLineItems
                                  .filter(item => (item.onHandQuantity >= item.quantityRequested 
                                                    && item.quantityRequested > item.deliveredQuantity));
      this.invoicedProductList.forEach(item => item.invoicedQuantity = item.quantityRequested - item.deliveredQuantity);                
    });  
  }

  onSubmit() {
    const invoice = this.prepareSaveInvoice();
    this.invoiceDataService.createInvoice(invoice).then(() => {
      let snackbarRef = this.snackbar.open('Invoice created successfully', 'Done');
      snackbarRef.afterDismissed().subscribe(() => {
        this.goBack();
      });
    });
  }

  prepareSaveInvoice(): Invoice {
    const formModel = this.createInvoiceForm.value;
    const totals = this.productListTable.dataSource.totals;

    const invoice: Invoice = {
      customerUuid: this.customer.customerUuid,
      status: 'OPEN',
      orgUuid: this.authService.getOrgUuid(),
      invoiceNotes: formModel.notes,
      invoicedLineItems: this.invoicedProductList,
      orderUuid: this.order.orderUuid,
      invoiceDate: formModel.invoiceDate,
      tax1: totals.totalTax,
      totalDiscount: totals.totalDiscount,
      totalAmount: totals.totalAmount
    }

    return invoice;
  }

  revert() {
    this.createInvoiceForm.reset();
  }

  goBack() {
    this.location.back();
  }

}