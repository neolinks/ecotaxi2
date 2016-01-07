import {inject} from 'aurelia-framework';
import {AuthService} from 'AuthService';

@inject(AuthService)
export class Login{
    constructor(AuthService){
        this.login = () => {
            if (this.username && this.password && this.local_password) {
                this.error = AuthService.login(this.username, this.password, this.local_password);
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