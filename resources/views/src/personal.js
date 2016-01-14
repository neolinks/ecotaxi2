import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';
import 'bootstrap';
@inject(HttpClient)
export class Personal{

    orderParams =[
         {name : 'source-address', displayName : 'Адрес подачи', value : this.sourceAddress},
         {name : 'dest-adress', displayName : 'Адрес назначения', value : this.destAddress},
         {name : 'source-time', displayName : 'Время', value : this.sourceTime},
         {name : 'phone', displayName : 'Телефон', value : this.phone},
         {name : 'passenger', displayName : 'Пассажир', value : this.passenger},
         {name : 'comment', displayName : 'Комментарий', value : this.comment}
    ];
    //params = {
    //    sourceAddress: {name: 'source-address', displayName: 'Адрес подачи', value: ''},
    //    destAddress: {name: 'dest-address', displayName: 'Адрес назначения', value: ''},
    //    sourceTime: {name: 'source-time', displayName: 'Время', value: ''},
    //    phone: {name: 'phone', displayName: 'Телефон', value: ''},
    //    passanger: {name: 'passenger', displayName: 'Пассажир', value: ''},
    //    comment: {name: 'comment', displayName: 'Комментарий', value: ''}
    //};
    constructor(){
        this.sourceAddress ='';
        this.destAddress ='';
        this.sourceTime ='';
        this.phone='';
        this.passenger='';
        this.comment = 'test';
    }
    clear(){
        console.log(this.sourceAddress);
    }
}