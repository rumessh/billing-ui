import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Product } from '../../catalog/catalog-data/catalog-data';
import { AuthService } from '../../../shared/auth-service/auth-service';
import { Customer } from '../../customer/customer-data/customer-data';

export interface Invoice {
    invoiceUuid?: String,
    orderUuid: String,
    invoiceName?: String,
    invoiceDate?: String,
    customerUuid: String,
    orgUuid: String,
    status: String,
    invoiceNotes?: String,
    invoicedLineItems: Product[],
    customer?: Customer,
    tax1?: number,
    totalDiscount?: number,
    totalAmount?: number
}


let headers = new Headers({ 'Content-Type': 'application/json' });

export class InvoiceDataPaginated {

    private url = '/api/billing/org/'+ this.authService.getOrgUuid() +'/invoiceapi/v1/invoices';
    totalCount: any;

    getInvoiceByUuid(invoiceUuid: String):Promise<Invoice> {
        const url = '/api/billing/org/'+ this.authService.getOrgUuid() +'/invoiceapi/v1/invoice/'+invoiceUuid;
        return this.http
            .get(url, {headers: headers})
            .toPromise()
            .then((response: Response) => Promise.resolve(response.json()))
            .catch((error: any) => Promise.reject(error.message || error));
    }

    getInvoiceList(start, size): Observable<Invoice[]> {
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
    }

    createInvoice(invoice: Invoice): Promise<Invoice> {
        const url = '/api/billing/org/'+ this.authService.getOrgUuid() +'/invoiceapi/v1/invoice';
        return this.http
            .post(url, JSON.stringify(invoice), { headers: headers })
            .toPromise()
            .then(() => invoice)
            .catch((error: any) => Promise.reject(error.message || error));
    }

    constructor(private http: Http, private authService: AuthService) { }
}

@Injectable()
export class InvoiceDataService {

    invoiceDataPaginated: InvoiceDataPaginated | null;

    getInvoicePagenated(start: number, size: number): Observable<Invoice[]> {
        return this.invoiceDataPaginated.getInvoiceList(start, size);
    }

    createInvoice(invoice: Invoice): Promise<Invoice> {
        return this.invoiceDataPaginated.createInvoice(invoice);
    }

    getInvoiceByUuid(invoiceUuid: String): Promise<Invoice> {
        return this.invoiceDataPaginated.getInvoiceByUuid(invoiceUuid);
    }

    constructor(private http: Http, private authService: AuthService) {
        this.invoiceDataPaginated = new InvoiceDataPaginated(http, authService);
    }
}