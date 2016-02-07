import {AuthService} from 'AuthService';
import {HttpClient, json} from 'aurelia-fetch-client';
import {inject} from 'aurelia-framework';
import config from 'config';
import states from 'states';
import {Cookie} from 'aurelia-cookie';
import moment from 'moment';

@inject(AuthService,HttpClient)
export class CurrentOrders{
    constructor(AuthService,HttpClient) {
        this.loading = true;
        let city = Cookie.get('city');
        this.city = city == 'Almaty' ? 1 : 2;
        this.auth = AuthService.session;
        HttpClient.configure(http => {
            http.withBaseUrl(config.baseUrl);
        }).fetch(config.currentOrdersUrl+this.auth.id+"?city="+city)
            .then((response) => response.json())
            .then((orders)=>{
                if(Array.isArray(orders)){
                    this.orders = orders;
                    this.loading = false;
                }else{
                    this.errors = 'Произошла ошибка повторите позже';
                }
            })
    }
    attached(){

    }
    parseTime(time){
        let originalFormat = 'YYYYMMDDHHmmss';
        let format = 'YYYY.MM.DD HH:mm';
        return moment(time,originalFormat).format(format);
    }
}