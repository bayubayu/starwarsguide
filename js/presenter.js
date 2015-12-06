(function(window){
    'use strict'

    // Presenter constructor
    function Presenter(model, view, appPresenter) {
        this.model = model;
        this.view = view;
        this.appPresenter = appPresenter;
        this.pageLoading = false;

        this.listLoaded = false; // indicated list already executed
        //bind view's events
        this._bindViewEvents();
    }

    Presenter.prototype._bindViewEvents = function() {
        this.view.onNextPage((function(){
            this.loadList();
        }).bind(this));
    };

    // go to section
    Presenter.prototype.go = function() {
        this.show();

        if (this.model.currentPage < 1) {
            this.loadList();
        }
    };

    // show
    Presenter.prototype.show = function() {
        this.appPresenter && this.appPresenter.hideAllSections();
        this.view.show();
    };


    Presenter.prototype.loadList = function() {
        if (this.pageLoading) return false;
        this.pageLoading = true;
        // manipulate model
        if (this.model.noMorePage) return false; // todo:show warning
        this.view.renderLoader('show');
        this.model.getNextPage(
            function(newIds){
                // todo: update view based on new model
                var i, data = [];
                for (i=0; i<newIds.length; i++) {
                    data.push(this.model.data[newIds[i]]);
                }

                this.pageLoading = false;
                this.view.renderLoader('hide');
                this.view.renderList(data);
            }.bind(this),
            function(error){
                this.view.renderLoader('hide');
                this.pageLoading = false;
            }.bind(this));
    };

    Presenter.prototype.loadDetail = function(id) {
        this.show();
        this.view.renderLoader('show');
        this.view.showDetail();
        this.model.get(
            id,
            function(ids){
                this.view.renderDetail(id,this.model.data[id]);
                this.view.renderLoader('hide');

                if (this.model.currentPage < 1) {
                    this.loadList();
                }

                // transform cards
                var cards = this.view.getCurrentDetailCards();
                this.appPresenter && this.appPresenter.loadCards(cards, this)
            }.bind(this),
            function(error){
                console.log('presenter index error: ',error);
            });

    };

    Presenter.prototype.updateCard = function(el, id,data) {
        this.view.updateCard(el,(data.title || data.name));
    };

    window.app = window.app || {};
    window.app.Presenter = Presenter;
}(window));