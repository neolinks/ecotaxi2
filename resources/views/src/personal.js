import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {YandexMaps} from 'YandexMaps';
import {ObserverLocator} from 'aurelia-framework';
import 'fetch';
import 'bootstrap';
@inject(HttpClient,ObserverLocator)
export class Personal{
        sourceAddress = '';
        destAddress = '';
        sourceTime = '';
        phone = '';
        passenger= '';
        comment = '';
    //orderParams =[
    //     {name : 'source-address', displayName : 'Адрес подачи', value : this.sourceAddress},
    //     {name : 'dest-adress', displayName : 'Адрес назначения', value : this.destAddress},
    //     {name : 'source-time', displayName : 'Время', value : this.sourceTime},
    //     {name : 'phone', displayName : 'Телефон', value : this.phone},
    //     {name : 'passenger', displayName : 'Пассажир', value : this.passenger},
    //     {name : 'comment', displayName : 'Комментарий', value : this.comment}
    //];
    //params = {
    //    sourceAddress: {name: 'source-address', displayName: 'Адрес подачи', value: ''},
    //    destAddress: {name: 'dest-address', displayName: 'Адрес назначения', value: ''},
    //    sourceTime: {name: 'source-time', displayName: 'Время', value: ''},
    //    phone: {name: 'phone', displayName: 'Телефон', value: ''},
    //    passanger: {name: 'passenger', displayName: 'Пассажир', value: ''},
    //    comment: {name: 'comment', displayName: 'Комментарий', value: ''}
    //};
    constructor(HttpClient,ObserverLocator){
        this.http = HttpClient;
        this.observerLocator = ObserverLocator;
        let sourceDispose = this.observerLocator
            .getObserver(this, 'sourceAddress')
            .subscribe(this.sourceAddressGeocode);
        let destDispose = this.observerLocator
            .getObserver(this, 'destAddress')
            .subscribe(this.destAddressGeocode);
        YandexMaps.init();
    }
    sourceAddressGeocode(newValue,oldValue){
        YandexMaps.geoCode(1,newValue);
    }
    destAddressGeocode(newValue,oldValue){
        YandexMaps.geoCode(2,newValue);
    }
    activate(){
       // this.sourceAddress ='';
        this.destAddress ='';
        this.sourceTime ='';
        this.phone='';
        this.passenger='';
        this.comment = '';
        YandexMaps.clear();
    }
}