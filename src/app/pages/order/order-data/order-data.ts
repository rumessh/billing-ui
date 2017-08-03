import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

export interface Order {
    purchaseOrderUuid?: String,
    purchaseOrderName: String,
    createdDate?: String,
    userUuid?: String,
    customerUuid: String,
    orgUuid: String,
    status: String,
    purchaseOrderNotes?: String
}


let headers = new Headers({ 'Content-Type': 'application/json' });

export class OrderDataPaginated {

    private url = 'http://localhost:8081/billing/org/cb84016e-73d9-11e7-8a46-1db42fcd78ef/orderapi/v1/orders';
    totalCount: any;

    getOrderList(start, size): Observable<Order[]> {
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

    createOrder(order: Order): Promise<Order> {
        const url = 'http://localhost:8081/billing/org/cb84016e-73d9-11e7-8a46-1db42fcd78ef/orderapi/v1/order';
        return this.http
            .post(url, JSON.stringify(order), { headers: headers })
            .toPromise()
            .then(() => order)
            .catch((error: any) => Promise.reject(error.message || error));
    }

    constructor(private http: Http) { }
}

@Injectable()
export class OrderDataService {

    orderDataPaginated: OrderDataPaginated | null;

    getOrderPagenated(start: number, size: number): Observable<Order[]> {
        return this.orderDataPaginated.getOrderList(start, size);
    }

    createOrder(order: Order): Promise<Order> {
        return this.orderDataPaginated.createOrder(order);
    }

    constructor(private http: Http) {
        this.orderDataPaginated = new OrderDataPaginated(http);
    }
}