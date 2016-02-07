import {inject,customElement, bindable} from 'aurelia-framework';
import moment from 'moment';
import {datepicker} from 'bootstrap-datetimepicker';


@inject(Element)
export class DatePicker {
    @bindable format = "DD-MMM-YYYY HH:mm";
    @bindable time;
    constructor(element) {
        this.element = element;
    }

    attached() {
        this.datePicker = $('#datetimepicker4').datetimepicker({
            format: this.format,
            showClose: true,
            locale : 'ru',
            useCurrent : true,
            collapse : true,
            sideBySide : true,
            allowInputToggle: true,
        });
        this.datePicker.on("dp.change", (e) => {
            this.time = moment(e.date).format(this.format);
            console.log(this.time);
        });
    }
}
