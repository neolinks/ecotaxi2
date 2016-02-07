import {AuthService} from 'AuthService';
import {HttpClient, json} from 'aurelia-fetch-client';
import {inject} from 'aurelia-framework';
import config from 'config';
import {Cookie} from 'aurelia-cookie';
import moment from 'moment';

@inject(HttpClient,AuthService)
export class Feedback{
    constructor(HttpClient,AuthService){
        this.email = '';
        this.comment = '';
        this.name = '';
        this.loading = false;
        let city = Cookie.get('city');
        this.city = city == 'Almaty' ? 1 : 2;
        this.auth = AuthService.session;
        HttpClient.configure(http => {
            http.withBaseUrl(config.baseUrl);
        });
        this.http = HttpClient;
    }
    send(){
        this.loading = true;
        if(this.email.length == 0 && this.comment.length == 0 && this.name.length == 0){
            this.errors = 'Все поля обязательные';
            this.loading = false;
        }else{
            this.errors = '';
            this.http.fetch(config.feedbackUrl,{
                method : 'post',
                body : json({name : this.name, email : this.email, comment : this.comment, city : this.city})
            }).then((response) => response.json())
            .then((orders)=>{
                this.loading = false;
                if(orders){
                    this.clear();
                }else{
                    this.errors = 'Произошла ошибка повторите позже.'
                }
            })
        }
    }
    clear(){
        this.email = '';
        this.comment = '';
        this.name = '';
    }
}