import {inject} from 'aurelia-framework';
import {AuthService} from 'AuthService';
import $ from 'jquery';
import 'bootstrap';
@inject(AuthService)
export class Login{
    constructor(AuthService){
        this.login = () => {
            if (this.username && this.password && this.local_password) {
                let response = AuthService.login(this.username, this.password, this.local_password,$('#loginModal'));
                setTimeout(() =>{
                    response.then((response)=>{
                        if(response != true){
                            this.error = response;
                        }
                    })
                },1000)
            } else {
                this.error = 'Введите пароль и логин';
            }
        }
    }
    activate() {
        this.username = '';
        this.password = '';
        this.local_password = '';
        this.error = '';
    }
}