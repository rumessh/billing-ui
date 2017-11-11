import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product, CatalogDataService, Category } from '../catalog-data/catalog-data';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../../shared/auth-service/auth-service';
import { omitBy } from 'lodash';

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
    productUuid: String;
    flow: String = "Create";
    productDetails: Product = {} as any;
    hsnCodes = [
        "09109100",
        "09109110",
        "09109120"
    ]

    constructor(private formBuilder: FormBuilder,
        private catalogDataService: CatalogDataService,
        private location: Location,
        private snackbar: MatSnackBar,
        private authService: AuthService,
        route: ActivatedRoute) {
        this.catalogDataService.getAllCategories().then((categories) => {
            this.categories = categories;
        });

        route.params.subscribe((params) => {
            this.productUuid = params.productId
            this.flow = this.productUuid ? "Update" : "Create";
            if (this.productUuid) {
                this.catalogDataService.getProduct(this.productUuid).then(response => {
                    this.productDetails = response;
                    this.createProductForm.setValue({
                        name: response.name,
                        productNumber: response.productNumber,
                        unitPrice: response.unitPrice,
                        onHandQuantity: response.onHandQuantity,
                        productDescription: response.productDescription,
                        keywords: response.keywords ? response.keywords.join('\n') : '',
                        category: this.categories.find(category => response.categoryUuid == category.id),
                        hsnCode: response.hsnCode,
                        taxPercentage: response.taxPercentage
                    })
                });
            }
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
            productDescription: '',
            keywords: '',
            category: ['', Validators.required],
            hsnCode: ['', Validators.required],
            taxPercentage: ['', Validators.required]
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
        if(this.flow === 'Update') {
            const product = this.prepareUpdateProduct();
            product['productUuid'] = this.productUuid;
            product['keywords'] = product['keywords'] ?  product['keywords'].split('\n') : [];
            this.catalogDataService.updateProduct(product).then(() => this.handleResponse("Product updated successfully."));
        }
        else {
            const product = this.prepareSaveProduct();            
            this.catalogDataService.createProduct(product).then(() => this.handleResponse("Product created successfully."));
        }
    }

    handleResponse(msg: string) {
        let snackbarRef = this.snackbar.open(msg, 'Done');
        snackbarRef.afterDismissed().subscribe(() => {
            this.goBack();
        });
    }

    prepareSaveProduct(): Product {
        const formModel = this.createProductForm.value;

        const product: Product = {
            name: formModel.name,
            categoryName: formModel.category.name,
            categoryUuid: formModel.category.categoryUuid,
            orgUuid: this.authService.getOrgUuid(),
            productDescription: formModel.productDescription,
            hsnCode: formModel.hsnCode,
            taxPercentage: formModel.taxPercentage,
            productNumber: formModel.productNumber,
            unitPrice: formModel.unitPrice,
            onHandQuantity: formModel.onHandQuantity,
            keywords: formModel.keywords.split('\n')
        };

        return product;
    }

    prepareUpdateProduct() {
        const formModel = this.createProductForm.value;
        const originalProduct = this.productDetails;
        return omitBy(formModel, (value, key) => {
            if(key === 'category') {
                if(originalProduct['categoryName'] !== formModel.category.name) {
                    formModel['categoryUuid'] = formModel.category.categoryUuid;
                    return false;
                }
                else {
                    return true;
                } 
            }
            return originalProduct[key] === value;
        });
    }

    revert() {
        this.createProductForm.reset();
    }

    goBack() {
        this.location.back();
    }
}