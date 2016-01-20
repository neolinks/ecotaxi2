import {inject, bindable} from 'aurelia-framework';
import config from 'config';
import {HttpClient,json} from 'aurelia-fetch-client';

@inject(HttpClient)
export class Popup{
    @bindable order_id;
    constructor(HttpClient){
        HttpClient.configure(http =>{
            http.withBaseUrl(config.baseUrl);
        });
        this.http = HttpClient;
        this.email = '';
    }

    close(){
        $("#parent_popup").css('display','none');
    }
    sendMail(){
        console.log(this.email);
        $("#parent_popup").css('display','none');
        this.http.fetch(config.sendMailUrl,{
            method : 'post',
            body : json({email: this.email, order_id : this.order_id})
        }).then((response) => response.json())
          .then((response)=>{
                console.log(response);
          })
        $("#parent_popup").css('display','none');
    }
}