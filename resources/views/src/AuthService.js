import {inject, Aurelia} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {Cookie} from 'aurelia-cookie';
import {User} from 'model/User';
import config from 'config';
import 'bootstrap';

@inject(Aurelia, HttpClient)
export class AuthService{

    constructor(Aurelia, HttpClient){
        HttpClient.configure(http =>{
           http.withBaseUrl(config.baseUrl);
        });
        this.http = HttpClient;
        this.app = Aurelia;
        this.session = JSON.parse(localStorage[config.tokenName] || null);
    }

    login(username, password, local_password,modal){
        let city = Cookie.get('city');
        return this.http
            .fetch(config.loginUrl, {
                method : 'post',
                body : json({login : username, password : password, local_password : local_password, city : city})
            })
            .then((response) => response.json())
            .then((session) => {
                if(session){
                    localStorage[config.tokenName] = JSON.stringify(session);
                    this.session = session;
                    modal.modal('hide');
                    this.app.setRoot('ecotaxi-personal');
                    return true;
                }else{
                    console.log('Auth error');
                    return 'Неправильный логин или пароль';
                }
            });
    }

    logout(){
        localStorage[config.tokenName] = null;
        this.session = null;
        this.app.setRoot('app');
    }

    isAuthenticated(){
        return this.session !== null;
    }
}