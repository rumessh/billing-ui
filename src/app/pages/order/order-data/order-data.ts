import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Product } from '../../catalog/catalog-data/catalog-data';
import {AuthService} from '../../../shared/auth-service/auth-service';
import { Customer } from '../../customer/customer-data/customer-data';


export interface Order {
    orderUuid?: String,
    orderName?: String,
    createdDate?: String,
    userUuid?: String,
    customerUuid: String,
    orgUuid: String,
    status: String,
    orderNotes?: String,
    orderLineItems: Product[],
    neededByDate: String,
    customer?: Customer,
    orderNumber?: String
}


let headers = new Headers({ 'Content-Type': 'application/json' });

export class OrderDataPaginated {

    private url = 'http://localhost:8081/billing/org/'+ this.authService.getOrgUuid() +'/orderapi/v1/orders';
    totalCount: any;

    getOrderByUuid(orderUuid: String):Promise<Order> {
        const url = 'http://localhost:8081/billing/org/'+ this.authService.getOrgUuid() +'/orderapi/v1/order/'+orderUuid;
        return this.http
            .get(url, {headers: headers})
            .toPromise()
            .then((response: Response) => Promise.resolve(response.json()))
            .catch((error: any) => Promise.reject(error.message || error));
    }

    getOrderList(start, size): Observable<Order[]> {
        var requestoptions = new RequestOptions({
            method: RequestMethod.Get,
            url: this.url,
            headers: new Headers({'Content-Type': 'application/json' , 'userUuid': 'b6d6eea0-7a5c-11e7-8718-d9a4a860e55c'}),
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
        const url = 'http://localhost:8081/billing/org/'+ this.authService.getOrgUuid() +'/orderapi/v1/order';
        return this.http
            .post(url, JSON.stringify(order), { headers: headers })
            .toPromise()
            .then(() => order)
            .catch((error: any) => Promise.reject(error.message || error));
    }

    searchOrder(orderNumber: String, customerUuid: String): Promise<Order[]> {
        return this.http
            .get(this.url, 
                {
                    headers: new Headers({'Content-Type': 'application/json' , 'userUuid': 'b6d6eea0-7a5c-11e7-8718-d9a4a860e55c'}),
                    params: {
                        "orderNumber" : orderNumber,
                        "customerUuid": customerUuid
                    }
                }
            )
            .toPromise()
            .then((response: Response) => Promise.resolve(response.json()))
            .catch((error: any) => Promise.reject(error.message || error));
    }

    constructor(private http: Http, private authService: AuthService) { }
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

    getOrderByUuid(orderUuid: String): Promise<Order> {
        return this.orderDataPaginated.getOrderByUuid(orderUuid);
    }

    searchOrder(orderNumber: String, customerUuid: String): Promise<Order[]> {
        return this.orderDataPaginated.searchOrder(orderNumber, customerUuid);
    }

    constructor(private http: Http, private authService: AuthService) {
        this.orderDataPaginated = new OrderDataPaginated(http, authService);
    }
}