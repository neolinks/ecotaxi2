import {Cookie} from 'aurelia-cookie';
import {json} from 'aurelia-fetch-client';
export class YandexMap{
    static cities = [
        {
            name : 'Казахстан, Алматы, ',
            center : [43.23912236, 76.92015652],
        },
        {
            name : 'Казахстан, Астана, ',
            center : [51.15305301, 71.42746452],
        }
    ];
    static city = null;
    static map = null;
    static sourcePlacemark = null;
    static destPlacemark = null;
    static sourceCoords = null;
    static destCoords = null;
    static route = null;
    constructor(){
        let city = Cookie.get('city');
        (city == 'Almaty') ? YandexMap.city = 0 : YandexMap.city = 1;
    }
    attached() {
        ymaps.ready(function(){
            YandexMap.map = new ymaps.Map("YMapsID", {
                center: YandexMap.cities[YandexMap.city].center,
                zoom: 12
            });
        });
    };

    clear(){
        YandexMap.sourcePlacemark = null;
        YandexMap.destPlacemark = null;
    }
    static geoCode(type,address){
        var myGeocoder = ymaps.geocode(YandexMap.cities[YandexMap.city].name +address);
        myGeocoder.then(
            function (res) {
                YandexMap.setPlacemark(type , res.geoObjects.get(0).geometry.getCoordinates());
            },
            function (err) {
                alert('Ошибка');
            }
        );
    }
    static reverseGeocode(type,address){
        var geoCoder = ymaps.geocode(YandexMap.cities[YandexMap.city].name + address,{
            kind : 'house',
            results : 1
        }).then(function(res){
            return res;
        },function(err){
            alert('Ошибка');
        });
        return geoCoder;
    }
    static removePlacemark(type){
        if(type == 1){
            YandexMap.map.geoObjects.remove(YandexMap.sourcePlacemark);
            YandexMap.sourcePlacemark = null;
        }else if(type ==2){
            YandexMap.map.geoObjects.remove(YandexMap.destPlacemark);
            YandexMap.destPlacemark = null;
        }else{
            YandexMap.map.geoObjects.remove(YandexMap.sourcePlacemark);
            YandexMap.map.geoObjects.remove(YandexMap.destPlacemark);
            YandexMap.sourcePlacemark = null;
            YandexMap.destPlacemark = null;
        }
    }
    static setPlacemark(type,coordinates){
        if(type == 1){
            if(YandexMap.sourcePlacemark == null){
                YandexMap.sourcePlacemark = new ymaps.Placemark(YandexMap.cities[YandexMap.city].center, {hintContent:'Откуда едем'}, {
                    iconLayout: 'default#image',
                    iconImageHref:'/img/a.png',
                    iconImageSize: [50, 65],
                    iconImageOffset: [-25, -32],
                    draggable: true
                });
                YandexMap.map.geoObjects.add(YandexMap.sourcePlacemark);
            }else{
                YandexMap.sourceCoords = coordinates;
                YandexMap.map.geoObjects.set(YandexMap.sourcePlacemark.geometry.setCoordinates(coordinates));
            }
        }else if(type == 2){
            if(YandexMap.destPlacemark == null){
                YandexMap.destPlacemark = new ymaps.Placemark(YandexMap.cities[YandexMap.city].center, {hintContent:'Куда едем'}, {
                    iconLayout: 'default#image',
                    iconImageHref:'/img/b.png',
                    iconImageSize: [50, 65],
                    iconImageOffset: [-25, -32],
                    draggable: true
                });
                YandexMap.map.geoObjects.add(YandexMap.destPlacemark);
            }else{
                YandexMap.destCoords = coordinates;
                YandexMap.map.geoObjects.set(YandexMap.destPlacemark.geometry.setCoordinates(coordinates));
            }
        }
    }
    static calculateRoute(){
        if(YandexMap.route != null){
            YandexMap.map.geoObjects.remove(YandexMap.route);
            YandexMap.route = null;
        }

        if(YandexMap.sourceCoords != null && YandexMap.destCoords != null){
            ymaps.route([YandexMap.sourceCoords,YandexMap.destCoords], {
                mapStateAutoApply : true
            }).then(function (route){
                route.getPaths().options.set({
                    strokeWidth : 4,
                    strokeColor: '0000ffff',
                    opacity: 0.9
                });
                YandexMap.route = route.getPaths();
                YandexMap.map.geoObjects.add(YandexMap.route);
            });
        }
    }
}