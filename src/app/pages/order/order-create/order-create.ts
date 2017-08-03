import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Order, OrderDataService } from '../order-data/order-data';
import { Location } from '@angular/common';
import {MdPaginatorModule, MdInputModule, MdButtonModule, MdTableModule, MdPaginator, PageEvent, MdSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Customer, CustomerDataService } from '../../customer/customer-data/customer-data';
import { Product, Category, CatalogDataService } from '../../catalog/catalog-data/catalog-data';
import {DataSource} from '@angular/cdk';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';


const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'order-create',
  templateUrl: 'order-create.html',
  styleUrls: ['order-create.scss'],
})
export class OrderCreate {

  createOrderForm: FormGroup;
  customer: Customer;
  categories: Category[];
  productSuggestionList: Product[];
  orderedProductList: Product[];
  dataSource: ProductDataSource;
  displayedColumns = ['name', 'hsnCode', 'productNumber', 'categoryName', 'unitPrice', 'onHandQuantity'];

  constructor(private cd: ChangeDetectorRef, 
    private formBuilder: FormBuilder,
    private orderDataService: OrderDataService,
    private location: Location,
    private snackbar: MdSnackBar,
    route: ActivatedRoute,
    private customerDataService: CustomerDataService,
    private catalogDataService: CatalogDataService) {
    let customerId;
    route.parent.params.subscribe((params) => {
      customerId = params.id
    });
    this.customerDataService.getCustomerData(customerId)
      .then((customer) => {
        this.createOrderForm.get('customer').setValue(customer.name);
        this.customer = customer;
      });
    this.catalogDataService.getAllCategories()
      .then((categories) => this.categories = categories);

    this.createOrderForm = this.formBuilder.group({
      name: ['', Validators.required],
      customer: [{ value: '', disabled: true }, Validators.required],
      category: [''],
      productName: ['']
    });
  }

  ngOnInit() {
    this.dataSource = new ProductDataSource([]);
    setTimeout(() => this.cd.markForCheck());
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

  searchProduct() {
    this.catalogDataService.searchProduct(this.createOrderForm.get('productName').value)
      .then((productList) => {
        productList.length > 1 ? this.productSuggestionList =
          productList : this.addProductToOrder(productList);
      });
  }

  addProductToOrder(productList: Product[]) {
      this.orderedProductList = this.orderedProductList ? [...this.orderedProductList, ...productList] : productList;
      this.dataSource = new ProductDataSource(this.orderedProductList);
  }

  prepareSaveOrder(): Order {
    const formModel = this.createOrderForm.value;

    const order: Order = {
      purchaseOrderName: formModel.name,
      userUuid: 'cb84016e-73d9-11e7-8a46-1db42fcd78ef',
      customerUuid: formModel.customerUuid,
      status: formModel.status,
      orgUuid: 'cb84016e-73d9-11e7-8a46-1db42fcd78ef',
      purchaseOrderNotes: formModel.notes
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

export class ProductDataSource extends DataSource<any> {
  constructor(private data: Product[]) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    return Observable.of(this.data);
  }

  disconnect() {}
}