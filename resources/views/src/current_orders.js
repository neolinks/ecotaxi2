import {AuthService} from 'AuthService';
import {HttpClient, json} from 'aurelia-fetch-client';
import {inject} from 'aurelia-framework';
import config from 'config';
import {Cookie} from 'aurelia-cookie';


@inject(AuthService,HttpClient)
export class CurrentOrders{
    constructor(AuthService,HttpClient) {
        let city = Cookie.get('city');
        this.city = city == 'Almaty' ? 1 : 2;
        this.auth = AuthService.session;
        HttpClient.configure(http => {
            http.withBaseUrl(config.baseUrl);
        }).fetch(config.currentOrdersUrl+this.auth.id+"?city="+city)
            .then((response) => response.json())
            .then((orders)=>{
                console.log(orders);
                if(Array.isArray(orders)){
                    this.orders = orders;
                }else{
                    this.errors = 'Произошла ошибка повторите позже';
                }
            })
    }
    attached(){

    }
}