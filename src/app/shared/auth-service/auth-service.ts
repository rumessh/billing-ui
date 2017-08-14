import { Injectable } from '@angular/core';

/**
 * Service responsible for setting the title that appears above the components and guide pages.
 */
@Injectable()
export class AuthService {
    
    _orgUuid: String = '';

    getOrgUuid() {
        return 'd9c6c6e8-7a47-11e7-8718-d9a4a860e55c';
    }
}