/**
 * Created by ernar on 06-Jan-16.
 */
import {Cookie} from 'aurelia-cookie';

export class CitySwitcher{
    cities = [];
    constructor(){
        this.selectedCity = Cookie.get('city');
        this.cities = [
            {
                name : 'Almaty',
                displayName : 'Алматы',
            },
            {
                name : 'Astana',
                displayName : 'Астана',
            }
        ];
    }
    changeCity(city){
        if(city != this.selectedCity){
            Cookie.set('city',city);
            window.location.reload();
        }
    }
}