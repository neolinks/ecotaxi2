import {inject,ObserverLocator,bindable} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {YandexMap} from 'yandex-map';
import {Cookie} from 'aurelia-cookie';
import {AuthService} from 'AuthService';
import $ from 'jquery';
import config from 'config';
import 'fetch';
import 'bootstrap';

@inject(HttpClient,ObserverLocator,YandexMap,AuthService)
export class Personal{
    @bindable stime = '';
    @bindable order_id = '';
    constructor(HttpClient,ObserverLocator,YandexMap, AuthService){
        HttpClient.configure(http =>{
            http.withBaseUrl(config.baseUrl);
        });
        this.http = HttpClient;
        this.observerLocator = ObserverLocator;
        this.user = AuthService.session;
        this.map = YandexMap;
        this.subscription = [];
        this.errors = [];
        this.loading = false;
    }
    activate(){
        this.sourceAddress = '';
        this.destAddress = '';
        this.stime = '';
        this.phone = null;
        this.passenger = '';
        this.comment = '';
        this.subscription.push(
            this.observerLocator.getObserver(this,'sourceAddress').subscribe(
                (newValue,oldValue) => {
                    if(newValue.length == 0){
                        console.log('ABS');
                        YandexMap.removePlacemark(1);
                        YandexMap.sourceCoords = null;
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
                    if(newValue.length == 0){
                        console.log('ABD');
                        YandexMap.removePlacemark(2);
                        YandexMap.destCoords = null;
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
                       YandexMap.map.geoObjects.remove(YandexMap.route);
                       return false;
                   }else if(YandexMap.destCoords == null){
                       YandexMap.map.geoObjects.remove(YandexMap.route);
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
                        YandexMap.map.geoObjects.remove(YandexMap.route);
                        return false;
                    }else if(YandexMap.sourceCoords == null){
                        YandexMap.map.geoObjects.remove(YandexMap.route);
                        return false;
                    }else{
                        YandexMap.calculateRoute();
                    }
                }
            )
        );
    }
    deactivate () {
        while (this.subscription.length) { this.subscription.pop(); }
    }
    clearForm(){
        this.sourceAddress = '';
        this.destAddress = '';
        this.stime = null;
        this.phone = null;
        this.passenger =null;
        this.comment = null;
        this.errors = [];
        YandexMap.removePlacemark(0);
    }

    submitOrder(){
        let city = Cookie.get('city');
        this.errors = [];
        if(!Array.isArray(YandexMap.sourceCoords)){
            this.errors.push('Не указан правильный адрес подачи');
        }
        if(!Array.isArray(YandexMap.destCoords)){
            this.errors.push('Не указан правильный адрес назначения');
        }
        if(this.stime == ''){
            this.errors.push('Необходимо заполнить поле Время подачи.');
        }
        if(!this.phonePars($("#phone").val())){
            this.errors.push('Номер телефона заполнен некорректно.');
        }else{
            this.phone = '87079941102';
        }
        if(this.passenger == ''){
            this.errors.push('Необходимо заполнить поле Пассажир');
        }
        if(this.errors.length == 0){
            this.loading = true;
            this.http.fetch(config.createOrderUrl,{
                method:'post',
                body : json({
                    source_coords : YandexMap.sourceCoords,
                    dest_coords : YandexMap.destCoords,
                    stime : this.stime,
                    phone : this.phone,
                    passenger : this.passenger,
                    comment : this.comment,
                    city : city})
            }).then((response) => response.json())
              .then((response) => {
                    if(response){
                        this.order_id = response;
                        this.loading = false;
                        $("#parent_popup").css('display','block');
                        $('.myClass').animate({'left':'40%'},550);
                        this.clearForm();
                    }
                    console.log(response);
              })

        }
    }
    phonePars(maskedPhone){
        var regexp = "^[8]\\([7]\\d{2}\\) \\d{3}-\\d{4}";
        if(maskedPhone.match(regexp)){
            return true;
        }else{
            return false;
        }
    }
}