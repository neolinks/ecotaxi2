import {AuthService} from 'AuthService';
import {inject} from 'aurelia-framework';
import  $ from 'jquery';

@inject(AuthService)
export class EcotaxiPersonal{
    constructor(AuthService){
        this.user = AuthService.session;
    }
    getClientInfo(){
        return `Личный кабинет / Клиент - ${this.user.company} / ${this.user.name}`;
    }
    configureRouter(config, router) {
        config.title = 'Экотакси';
        config.map([
            { route: ['','personal'], name: 'personal', moduleId: './personal', nav: true, title:'Заказ такси',settings:{img : './img/menu/m11.png',actImg : '/img/menu/m12.png'}},
            { route: 'company_info', name: 'company_info', moduleId: './company_info', nav: true, title:'Данные компании',settings:{img : './img/menu/m21.png',actImg : '/img/menu/m22.png'} },
            { route: 'current_orders', name: 'current_orders', moduleId: './current_orders', nav: true, title:'Текущие заказы',settings:{img : './img/menu/m31.png',actImg : '/img/menu/m32.png'}},
            { route: 'history', name: 'history', moduleId: './history', nav: true, title:'История заказов',  settings:{img : './img/menu/m41.png',actImg : '/img/menu/m42.png'}},
            { route: 'feedback', name: 'feedback', moduleId: './feedback', nav: true, title:'Отписать отзыв', settings:{img : './img/menu/m51.png',actImg : '/img/menu/m52.png'}},
            //{ route: ['','/logout'], name: '/logout', moduleId: './personal', nav: true, title:'Выход' },
        ]);

        this.router = router;
    }

}