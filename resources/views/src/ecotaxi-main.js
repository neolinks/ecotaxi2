import {inject} from 'aurelia-framework';
import {Cookie} from 'aurelia-cookie';
import {AuthService} from 'AuthService';

export function configure(aurelia){
	aurelia.use
		.defaultBindingLanguage()
        .defaultResources()
        .history()
        .router()
        .developmentLogging()
        .eventAggregator()
    let city = Cookie.get('city');
    if(!city)
    	Cookie.set('city','Almaty');

    aurelia.start().then(() => {
        var auth = aurelia.container.get(AuthService);
        let root = auth.isAuthenticated() ? 'ecotaxi-personal' : 'app';
        aurelia.setRoot(root);
    });

}

export class EcotaxiMain{
    configureRouter(config, router) {
        config.title = 'Ecotaxi';
        config.map([
            { route: '/', name: '/', moduleId: './ecotaxi-main', nav: true, title:'Экотакси' }
        ]);

        this.router = router;
    }
}