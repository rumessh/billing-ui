import { Injectable } from '@angular/core';

/**
 * Service responsible for setting the title that appears above the components and guide pages.
 */
@Injectable()
export class AuthService {
    
    _orgUuid: String = '';

    getOrgUuid() {
        return '81a5b183-86df-11e7-9412-0242ac110002';
    }
}