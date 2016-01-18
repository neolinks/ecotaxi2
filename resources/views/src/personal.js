import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {YandexMap} from 'yandex-map';
import {ObserverLocator} from 'aurelia-framework';
import 'fetch';
import 'bootstrap';
@inject(HttpClient,ObserverLocator,YandexMap)
export class Personal{


    //get sourceAddress(){return this.sourceAddress}
    //set sourceAddress(sourceAddress){this.sourceAddress = sourceAddress}
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
    constructor(HttpClient,ObserverLocator,YandexMap){
        this.http = HttpClient;
        this.observerLocator = ObserverLocator;
        this.map = YandexMap;
        this.subscription = [];
        this.sourceAddress ='';
        this.destAddress ='';
        this.sourceTime ='';
        this.phone ='';
        this.passenger ='';
        this.comment = '';
    }
    activate(){
        this.subscription.push(
            this.observerLocator.getObserver(this,'sourceAddress').subscribe(
                (newValue,oldValue) => {
                    if(newValue == null){
                        YandexMap.removePlacemark(1);
                        return false;
                    }else if(newValue !== oldValue){
                        YandexMap.reverseGeocode(1,newValue).then((response) =>{
                            this.sourceAddress = response.geoObjects.get(0).properties.get('name');
                            YandexMap.setPlacemark(1,response.geoObjects.get(0).geometry.getCoordinates());
                        });
                    }
                }
            )
        );
        this.subscription.push(
            this.observerLocator.getObserver(this, 'destAddress').subscribe(
                (newValue,oldValue) => {
                    if(newValue == null){
                        YandexMap.removePlacemark(2);
                        return false;
                    }else if(newValue !== oldValue){
                        YandexMap.reverseGeocode(2,newValue).then((response) =>{
                            this.destAddress = response.geoObjects.get(0).properties.get('name');
                            YandexMap.setPlacemark(2,response.geoObjects.get(0).geometry.getCoordinates());
                        });
                    }
                }
            )
        );
        this.subscription.push(
            this.observerLocator.getObserver(YandexMap,'sourceCoords').subscribe(
                (newValue,oldValue) => {
                   if(YandexMap.sourceCoords == null){
                       return false;
                   }else if(YandexMap.destCoords == null){
                       return false;
                   }else{
                       YandexMap.calculateRoute();
                   }
                }
            )
        );
        this.subscription.push(
            this.observerLocator.getObserver(YandexMap,'destCoords').subscribe(
                (newValue,oldValue) => {
                    if(YandexMap.destCoords == null){
                        return false;
                    }else if(YandexMap.sourceCoords == null){
                        return false;
                    }else{
                        YandexMap.calculateRoute();
                    }
                }
            )
        );
    }
    clearForm(){
        this.sourceAddress ='';
        this.destAddress ='';
        this.sourceTime ='';
        this.phone ='';
        this.passenger ='';
        this.comment = '';
        YandexMap.removePlacemark(0);
    }
    deactivate () {
        while (this.subscriptions.length) { this.subscriptions.pop()(); }
    }
}