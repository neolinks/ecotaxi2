import {Cookie} from 'aurelia-cookie';

export class ContactInfo{
    phones = [];

    constructor(){
        let city = Cookie.get('city');
        if(city == 'Almaty'){
            this.phones = [
                {
                    number : '+77273900500',
                    displayName : '+7 (727) 3 900 500'
                },
                {
                    number : '+77776727777',
                    displayName : '+7 (777) 672 77 77'
                }
            ];
        }else {
            this.phones = [
                {
                    number : '+77172999702',
                    displayName : '+7 (7172) 999 702'
                },
                {
                    number : '+77776467777',
                    displayName : '+7 (777) 646 7777'
                }
            ];
        }
    }
}