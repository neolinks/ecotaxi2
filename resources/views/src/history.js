import {bindable,inject} from 'aurelia-framework';
import {AuthService} from 'AuthService';
import {HttpClient, json} from 'aurelia-fetch-client';
import config from 'config';
import states from 'states';
import {Cookie} from 'aurelia-cookie';
import moment from 'moment';

@inject(AuthService, HttpClient)
export class History{
    @bindable begin;
    @bindable end;
    constructor(AuthService,HttpClient) {
        HttpClient.configure(http =>{
            http.withBaseUrl(config.baseUrl);
        });
        let city = Cookie.get('city');
        this.city = city == 'Almaty' ? 1 : 2;
        this.auth = AuthService.session;
        this.http = HttpClient;
        this.orders = [];
        this.loading = false;
        this.emptyResult = false;
        this.errors = '';
    }
    show(){
        if(!this.checkTimerange(this.begin,this.end))
            return false;
        this.loading = true;
        this.http
            .fetch(config.historyUrl,{
                method : 'post',
                body   : json({
                    id:this.auth.id,
                    begin:moment(this.begin,"DD-MM-YYYY HH:mm").format('YYYYMMDDHHmmss'),
                    end:moment(this.end,"DD-MM-YYYY HH:mm").format('YYYYMMDDHHmmss'),
                    city : this.city
                })
            })
            .then((response) => response.json())
            .then((orders)=>{
                this.loading = false;
                if(orders.length == 0) {
                    this.emptyResult = true;
                    return false;
                }
                if(Array.isArray(orders)){
                    this.orders = orders;
                }else{
                    this.errors = 'Произошла ошибка повторите позже';
                }
            })
    }
    checkTimerange(begin,end){
        let isAfter = moment(end).isAfter(moment(begin));
        if(!isAfter)
            this.errors = 'Укажите правильный интервал'
        else
            this.errors = '';
        return isAfter;
    }
    parseTime(time){
        let originalFormat = 'YYYYMMDDHHmmss';
        let format = 'YYYY.MM.DD HH:mm';
        return moment(time,originalFormat).format(format);
    }
    getState(stateNumber){
        console.log(stateNumber);
        return states.stateNumber.status;
    }
}