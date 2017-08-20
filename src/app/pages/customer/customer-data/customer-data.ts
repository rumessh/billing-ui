import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { AuthService } from '../../../shared/auth-service/auth-service';

export interface Customer {
    customerUuid?: String;
    name: String;
    phone: String;
    orgUuid: String;
    addressUuid?: String;
}

export class CustomerDataPaginated {

    private url = 'http://localhost:8081/billing/org/' + this.authService.getOrgUuid() + '/customerapi/v1/customers';
    totalCount: any;

    getCustomerList(start, size): Observable<any> {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
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
        this.totalCount = result.json().length;
        return result.json();
    }

    constructor(private http: Http, private authService: AuthService) { }
}

@Injectable()
export class CustomerDataService {

    private headers = new Headers({ 'Content-Type': 'application/json' });
    customerDataPaginated: CustomerDataPaginated | null;

    getCustomerData(customerId: String): Promise<Customer> {
        const url = 'http://localhost:8081/billing/org/' + this.authService.getOrgUuid() + '/customerapi/v1/customer/' + customerId;
        return this.http
            .get(url, { headers: this.headers })
            .toPromise()
            .then((response: Response) => Promise.resolve(response.json()))
            .catch((error: any) => Promise.reject(error.message || error));
    }

    searchCustomer(cusotomerName: String): Promise<Customer[]> {
        const url = 'http://localhost:8081/billing/org/'+ this.authService.getOrgUuid() +'/customerapi/v1/customers?customerName='+cusotomerName;
        return this.http
            .get(url, {headers: this.headers})
            .toPromise()
            .then((response: Response) => Promise.resolve(response.json()))
            .catch((error: any) => Promise.reject(error.message || error));
    }

    getCustomerPagenated(start: number, size: number): Observable<Customer[]> {
        this.customerDataPaginated = new CustomerDataPaginated(this.http, this.authService);
        return this.customerDataPaginated.getCustomerList(start, size);
    }

    createCustomer(customer: Customer): Promise<Customer> {
        const url = 'http://localhost:8081/billing/org/' + this.authService.getOrgUuid() + '/customerapi/v1/customer';
        return this.http
            .post(url, JSON.stringify(customer), { headers: this.headers })
            .toPromise()
            .then(() => customer)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

    constructor(private http: Http, private authService: AuthService) { }
}