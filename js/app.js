(function() {
    'use strict'

    var SWApp = {
        init: function() {
            var self = this;
            console.log('app start');

            // ajax cache
            self.cache = [];

            // App
            this.appView = new app.AppView('app-container');
            this.appPresenter = new app.AppPresenter({},this.appView);

            this.res = {
                'films':{},'people':{},'planets':{},'species':{},'starships':{},'vehicles':{}
            };

            var routes = {};

            var router = Router(routes);

            var prop;
            for (prop in this.res) {
                if (this.res.hasOwnProperty(prop)) {
                    this.res[prop].model = new app.Model({
                        resource: prop,
                        cache: self.cache
                    });
                    this.res[prop].view = new app.View(prop, 'page-container')//,
                    this.res[prop].presenter = new app.Presenter(this.res[prop].model, this.res[prop].view, this.appPresenter);

                    // define route
                    router.on('/'+prop+'/', this.res[prop].presenter.go.bind(this.res[prop].presenter) );
                    router.on('/'+prop+'/:id', this.res[prop].presenter.loadDetail.bind(this.res[prop].presenter) );

                    this.appPresenter.registerChildPresenter(prop,this.res[prop].presenter);
                }
            }



            // entry points!
            router.init('/films');


        }
    };

    SWApp.init();

}());