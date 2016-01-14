import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {bootstrapDropdownHover} from 'bootstrap/js/jquery.bootstrap-dropdown-hover.min';
import 'fetch';
import 'bootstrap';
import $ from 'bootstrap';
@inject(HttpClient)
export class Personal{
    dropdown(){
        $('ul.dropdown-menu').stop(true, true).delay(100).fadeIn();
        $('ul.dropdown-menu').mouseover(function(){
            $('ul.dropdown-menu').css("display","block");
        })
    }
    close(){
        $('ul.dropdown-menu').stop(true, true).delay(100).fadeOut();
    }

    source;
    dest;
    sourceTime;
    phone;
    passanger;
    comment;
}