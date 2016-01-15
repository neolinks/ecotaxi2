import {Cookie} from 'aurelia-cookie';
export class YandexMaps{
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
    static sourcePlacemark;
    static sourceCoords;
    static destPlacemark;
    static destCoords;
    static route = null;
    static map = null;
    static city = null;

    static init(){
        let city = Cookie.get('city');
        (city == 'Almaty') ? YandexMaps.city = 0 : YandexMaps.city = 1;

        ymaps.ready(function(){
            YandexMaps.map = new ymaps.Map("YMapsID", {
                center: YandexMaps.cities[YandexMaps.city].center,
                zoom: 12
            });
        });
        YandexMaps.sourcePlacemark = new ymaps.Placemark(YandexMaps.cities[YandexMaps.city].center, {hintContent:'Откуда едем'}, {
            iconLayout: 'default#image',
            iconImageHref:'/img/a.png',
            iconImageSize: [50, 65],
            iconImageOffset: [-25, -32],
            draggable: true
        });
        YandexMaps.destPlacemark = new ymaps.Placemark(YandexMaps.cities[YandexMaps.city].center, {hintContent:'Куда едем'}, {
            iconLayout: 'default#image',
            iconImageHref:'/img/b.png',
            iconImageSize: [50, 65],
            iconImageOffset: [-25, -32],
            draggable: true
        });
    }
    static clear(){
        YandexMaps.sourcePlacemark = null;
        YandexMaps.destPlacemark = null;
    }
    static geoCode(type,address){
        var myGeocoder = ymaps.geocode(YandexMaps.cities[YandexMaps.city].name+address);
        myGeocoder.then(
            function (res) {
                console.log(res.geoObjects.get(0).geometry.getCoordinates())
                let placemark  = YandexMaps.setPlacemark(type,res.geoObjects.get(0).geometry.getCoordinates());

                YandexMaps.map.geoObjects.add(placemark);
            },
            function (err) {
                alert('Ошибка');
            }
        );
    }
    static setPlacemark(type,coordinates){
        let placemarkType;

        console.log(YandexMaps.sourcePlacemark);
        console.log(YandexMaps.destPlacemark);

        if(placemarkType != null){
            console.log(placemarkType.editor);
            placemarkType.editor.geometry = coordinates;
        }else {
            placemarkType = new ymaps.Placemark(coordinates, {hintContent: type == 1 ? 'Откуда едем' : 'Куда едем'}, {
                iconLayout: 'default#image',
                iconImageHref: type == 1 ? '/img/a.png' : '/img/b.png',
                iconImageSize: [50, 65],
                iconImageOffset: [-25, -32],
                draggable: true
            });
        }
        return placemarkType;
    }
}