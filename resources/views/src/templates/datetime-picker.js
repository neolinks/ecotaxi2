import {inject,customElement, bindable} from 'aurelia-framework';
import moment from 'moment';
import {datepicker} from 'bootstrap-datetimepicker';


@inject(Element)
@bindable("value")
export class DatePicker {
    @bindable format = "DD-MMM-YYYY HH:mm";

    constructor(element) {
        this.element = element;
    }

    attached() {
        this.datePicker = $('#datetimepicker4').datetimepicker({
            format: this.format,
            showClose: true,
            locale : 'ru',
        });
        this.datePicker.on("dp.change", (e) => {
            this.value = moment(e.date).format(this.format);
        });
    }
}
