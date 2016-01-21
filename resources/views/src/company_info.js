import {AuthService} from 'AuthService';
import {inject} from 'aurelia-framework';

@inject(AuthService)
export class CompanyInfo{
    constructor(AuthService){
        this.user = AuthService.session;
    }
}