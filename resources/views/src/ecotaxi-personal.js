export class EcotaxiPersonal{
    configureRouter(config, router) {
        config.title = 'Aurelia';
        config.map([
            { route: ['','/'], name: '/', moduleId: './personal', nav: true, title:'Personal' }
        ]);

        this.router = router;
    }
}