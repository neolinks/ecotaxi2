import {inject,customElement, bindable} from 'aurelia-framework';
import moment from 'moment';
import {datepicker} from 'bootstrap-datetimepicker';


@inject(Element)
export class DatetimeRange {
    @bindable format = "DD-MM-YYYY HH:mm";
    @bindable tend;
    @bindable tbegin;
    constructor(element) {
        this.element = element;
    }

    attached() {
        this.beginDatePicker = $('#datetimepicker-begin').datetimepicker({
            format: this.format,
            showClose: true,
            locale : 'ru',
            useCurrent : true,
            collapse : true,
            sideBySide : true,
            allowInputToggle: true,
        });
        this.beginDatePicker.on("dp.change", (e) => {
            this.tbegin = moment(e.date).format(this.format);
        });
        this.endDatePicker = $('#datetimepicker-end').datetimepicker({
            format: this.format,
            showClose: true,
            locale : 'ru',
            useCurrent : true,
            collapse : true,
            sideBySide : true,
            allowInputToggle: true,
        });
        this.endDatePicker.on("dp.change", (e) => {
            this.tend = moment(e.date).format(this.format);
        });
    }
}
