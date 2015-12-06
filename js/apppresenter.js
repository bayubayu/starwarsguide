(function(window){
    'use strict'

    // AppPresenter constructor
    function AppPresenter(model, view) {
        this.model = model;
        this.view = view;
        this.childPresenters = [];
    }

    AppPresenter.prototype.hideAllSections = function() {
        this.view.hideAllSections();
    };

    AppPresenter.prototype.registerChildPresenter = function(id,presenter) {
        this.childPresenters[id] = presenter;
    };

    // this will be located in Apppresenter
    AppPresenter.prototype.loadCards = function(cards, presenter) {
        var i, id, presenterType, that = this;
        if (!cards.length) return false;
        for (i=0; i<cards.length; i++) {
            // todo this will be specific model

            (function() {
                var id, presenterType, el;
                presenterType = cards[i].type;
                id = cards[i].id;
                el = cards[i].el;
                that.childPresenters[presenterType].model.get(
                    id,
                    function (ids, data) {
                        presenter.updateCard(el, ids[0],data[ids[0]]);
                    }.bind(that),
                    function (error) {
                        console.log('presenter index error: ', error);
                    }.bind(that),
                    true,
                    true
                );


            }());

        }
    };


    window.app = window.app || {};
    window.app.AppPresenter = AppPresenter;
}(window));