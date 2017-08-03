import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product, CatalogDataService, Category } from '../catalog-data/catalog-data';
import { Location } from '@angular/common';
import { MdSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
    selector: 'product-create',
    templateUrl: 'product-create.html',
    styleUrls: ['product-create.scss'],
})
export class ProductCreate {

    createProductForm: FormGroup;
    filterHsnOptions: Observable<string[]>;
    categories: Category[] | null;
    hsnCodes = [
        "09109100",
        "09109110",
        "09109120"
    ]

    constructor(private formBuilder: FormBuilder,
        private catalogDataService: CatalogDataService,
        private location: Location,
        private snackbar: MdSnackBar) {
        this.catalogDataService.getAllCategories().then((categories) => {
            this.categories = categories;
        });
        this.buildProductForm();
        this.addAutoComplete();
    }

    buildProductForm() {
        this.createProductForm = this.formBuilder.group({
            name: ['', [Validators.required, Validators.maxLength(40)]],
            productNumber: '',
            unitPrice: ['', Validators.required],
            onHandQuantity: ['', Validators.required],
            description: '',
            keywords: '',
            category: ['', Validators.required],
            hsnCode: ['', Validators.required],
        });
    }

    addAutoComplete() {
        this.filterHsnOptions = this.createProductForm
            .get('hsnCode')
            .valueChanges
            .startWith(null)
            .map(val => val ? this.filterHsn(val) : this.hsnCodes.slice());
    }

    filterHsn(val: string): string[] {
        return this.hsnCodes.filter(option => new RegExp(`^${val}`, 'gi').test(option));
    }

    onSubmit() {
        const product = this.prepareSaveProduct();
        this.catalogDataService.createProduct(product).then(() => {
            let snackbarRef = this.snackbar.open('Product created successfully', 'Done');
            snackbarRef.afterDismissed().subscribe(() => {
                this.goBack();
            });
        });
    }

    prepareSaveProduct(): Product {
        const formModel = this.createProductForm.value;

        const product: Product = {
            name: formModel.name,
            categoryName: formModel.category.name,
            categoryUuid: formModel.category.categoryUuid,
            orgUuid: 'cb84016e-73d9-11e7-8a46-1db42fcd78ef',
            productDescription: formModel.description,
            hsnCode: formModel.hsnCode,
            productNumber: formModel.productNumber,
            unitPrice: formModel.unitPrice,
            onHandQuantity: formModel.onHandQuantity,
            keywords: formModel.keywords.split('\n')
        };

        return product;
    }

    revert() {
        this.createProductForm.reset();
    }

    goBack() {
        this.location.back();
    }
}