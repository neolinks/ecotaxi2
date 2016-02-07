import states from 'states';

export class stateFormatValueConverter{
    toView(value){
        return states[value].status;
    }
}