import {inject, Aurelia} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {Cookie} from 'aurelia-cookie';
import {User} from 'model/User';
import config from 'config';
import 'bootstrap';

@inject(Aurelia, HttpClient,User)
export class AuthService{

    constructor(Aurelia, HttpClient,User){
        HttpClient.configure(http =>{
           http.withBaseUrl(config.baseUrl);
        });
        this.http = HttpClient;
        this.app = Aurelia;
        this.user = User;
        this.session = JSON.parse(localStorage[config.tokenName] || null);
    }

    login(username, password, local_password){
        let city = Cookie.get('city');
        this.http
            .fetch(config.loginUrl, {
                method : 'post',
                body : json({login : username, password : password, local_password : local_password, city : city})
            })
            .then((response) => response.json())
            .then((client) => {
                console.log(client);
                if(client){
                    this.user = client;
                    localStorage[config.tokenName] = JSON.stringify(client.token);
                    this.session = client.token;
                    console.log(this.session);
                    console.log(this.user);
                    this.app.setRoot('ecotaxi-personal');
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