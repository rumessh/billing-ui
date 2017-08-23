import { Injectable } from '@angular/core';

/**
 * Service responsible for setting the title that appears above the components and guide pages.
 */
@Injectable()
export class AuthService {
    
    _orgUuid: String = '';

    getOrgUuid() {
        return '89311d7d-8780-11e7-8b19-0a580a100006';
    }
}