import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MdInputModule, MdButtonModule } from '@angular/material';
import { ProductListTable } from './product-list-table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Product, CatalogDataService } from '../catalog-data/catalog-data';

@Component({
    selector: 'product-search',
    styleUrls: ['product-search.scss'],
    templateUrl: "product-search.html"
})
export class ProductSearch {
    @Input() isAddEnabled;
    @Output() searchedProducts = new EventEmitter<Product[]>();
    @Output() productAdded = new EventEmitter<Product>();

    constructor(private catalogDataService: CatalogDataService,
        private formBuilder: FormBuilder) {
        this.buildProductSearchForm();
        this.bindValueChanges();
    }

    searchProductForm: FormGroup;
    searchProductList: Product[];
    productSuggestionList: Product[];
    selectedProduct: Product;
    categories: any[];

    searchProduct() {
        this.catalogDataService.searchProduct(this.searchProductForm.get('productName').value)
            .then((productList) => this.searchedProducts.emit(productList));
    }

    addProduct() {
        if(this.searchProductForm.valid) {
            this.selectedProduct.quantityRequested = this.searchProductForm.get('quantityRequested').value;
            this.productAdded.emit(this.selectedProduct);
            this.searchProductForm.reset();
        }
    }

    productSelected(selectedProduct: Product) {
        this.selectedProduct = selectedProduct;
    }

    buildProductSearchForm() {
        this.searchProductForm = this.formBuilder.group({
            category: '',
            productName: '',
            quantityRequested: ['', Validators.required]
        });
    }

    bindValueChanges() {
        this.searchProductForm.get('productName').valueChanges
            .debounceTime(400)
            .subscribe(name => {
                this.catalogDataService.searchProduct(this.searchProductForm.get('productName').value)
                    .then((productList) => this.productSuggestionList = productList);
            });
    }
    productAutoDisplay(product: Product) {
        return product ? product.name + ' : ' + product.hsnCode : product;
    }
}