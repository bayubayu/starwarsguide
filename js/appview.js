(function (window, $){
    'use strict';

    function AppView(elId) {
        this.elId = elId;

        this._renderTemplate();
        this._cacheElements();
        this._bindEvents();
    }

    AppView.prototype._renderTemplate = function() {
    };

    AppView.prototype._cacheElements = function() {
        // cache element
        this.$el = $('#'+ this.elId);
        this.$pageContainer = this.$el.find('#page-container');
    };

    AppView.prototype._bindEvents = function() {
        var self = this;
        $(document).on('ready', function(){
            self._resize();
        });
        $(window).on('resize', function(){
            self._resize();
        });
    };

    AppView.prototype._resize = function() {
        // dirty hack
        this.$pageContainer.find('.list-container, .detail-container').height(window.innerHeight);
    }

    AppView.prototype.hideAllSections = function() {
        this.$pageContainer.find('.page-section').hide();
    };

    window.app = window.app || {};
    window.app.AppView = AppView;
}(window,Zepto,Mustache));