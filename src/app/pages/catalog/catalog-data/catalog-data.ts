import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

export interface Product {
    productUuid?: String,
    name: String,
    categoryName: String,
    productDescription?: String,
    hsnCode: String,
    productNumber?: String,
    unitPrice: number,
    onHandQuantity: number,
    categoryUuid: String,
    orgUuid: String,
    keywords?: String[]
}

export interface Category {
    id?: String,
    name: String,
    orgUuid: String
}

let headers = new Headers({ 'Content-Type': 'application/json' });

export class ProductDataPaginated {

    private url = 'http://localhost:8081/billing/org/cb84016e-73d9-11e7-8a46-1db42fcd78ef/productapi/v1/products';
    totalCount: any;

    searchProduct(productName: String): Promise<Product[]> {
        const url = 'http://localhost:8081/billing/org/cb84016e-73d9-11e7-8a46-1db42fcd78ef/productapi/v1/products?productName='+productName;
        return this.http
            .get(url, {headers: headers})
            .toPromise()
            .then((response: Response) => Promise.resolve(response.json()))
            .catch((error: any) => Promise.reject(error.message || error));
    }

    getProductList(start, size): Observable<Product[]> {
        var requestoptions = new RequestOptions({
            method: RequestMethod.Get,
            url: this.url,
            headers: headers,
            params: {
                "start": start,
                "size": size
            }
        })
        return this.http.request(new Request(requestoptions)).map((result) => this.extractData(result));
    }

    extractData(result: Response): any {
        if (result.status == 200) {
            this.totalCount = result.json().length;
            return result.json();
        }
        else {
            return [{ hsnCode: 'HSN0001', name: 'Bill It', category: 'Software' }];
        }
    }

    createProduct(product: Product): Promise<Product> {
        const url = 'http://localhost:8081/billing/org/cb84016e-73d9-11e7-8a46-1db42fcd78ef/productapi/v1/product';
        return this.http
            .post(url, JSON.stringify(product), { headers: headers })
            .toPromise()
            .then(() => product)
            .catch((error: any) => Promise.reject(error.message || error));
    }

    constructor(private http: Http) { }
}

export class ProductCategoryData {

    createCategory(category: Category): Promise<Category> {

        const url = 'http://localhost:8081/billing/org/cb84016e-73d9-11e7-8a46-1db42fcd78ef/categoryapi/v1/category';
        return this.http
            .post(url, JSON.stringify(category), { headers: headers })
            .toPromise()
            .then(() => category)
            .catch((error: any) => Promise.reject(error.message || error));
    }
    
    getAllCategories() : Promise<Category[]> {
        const url = 'http://localhost:8081/billing/org/cb84016e-73d9-11e7-8a46-1db42fcd78ef/categoryapi/v1/categories';
        return this.http
            .get(url, {headers: headers})
            .toPromise()
            .then((response: Response) => Promise.resolve(response.json()))
            .catch((error: any) => Promise.reject(error.message || error));
    }

    constructor(private http: Http) { }
}

@Injectable()
export class CatalogDataService {

    productDataPaginated: ProductDataPaginated | null;
    productCategoryData: ProductCategoryData | null;

    getProductPagenated(start: number, size: number): Observable<Product[]> {
        return this.productDataPaginated.getProductList(start, size);
    }

    createProduct(product: Product): Promise<Product> {
        return this.productDataPaginated.createProduct(product);
    }

    createCategory(category: Category): Promise<Category> {
        return this.productCategoryData.createCategory(category);
    }

    getAllCategories(): Promise<Category[]> {
        return this.productCategoryData.getAllCategories();
    }

    searchProduct(productName: String): Promise<Product[]> {
        return this.productDataPaginated.searchProduct(productName);
    }

    constructor(private http: Http) {
        this.productDataPaginated = new ProductDataPaginated(http);
        this.productCategoryData = new ProductCategoryData(http);
    }
}