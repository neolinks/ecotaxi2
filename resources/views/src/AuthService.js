import {inject, Aurelia} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {Cookie} from 'aurelia-cookie';
import config from 'config';

@inject(Aurelia, HttpClient)
export class AuthService{
    client;
    constructor(Aurelia, HttpClient){
        HttpClient.configure(http =>{
           http.withBaseUrl(config.baseUrl);
        });
        this.http = HttpClient;
        this.app = Aurelia;
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
            .then((client) => client)
            .then((session)  => {
                if(session){
                    localStorage[config.tokenName] = JSON.stringify(session.token);
                    this.session = session;
                    this.app.setRoot('ecotaxi-personal');
                }else{

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