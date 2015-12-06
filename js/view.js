(function (window, $, Mustache){
    'use strict';

    /*
    *  View 'class'
    *
    * */
    function View(elId, parentElId) {
        this.elId = elId+'-view';
        this.$parentEl = $('#'+parentElId);

        this._renderTemplate(parentElId);
        this._cacheElements();
        this._bindEvents();
    }

    View.prototype._renderTemplate = function() {
        var template = $('#view-template').html();
        this.$parentEl.append(Mustache.render(template,{ id: this.elId }));
    };

    View.prototype._cacheElements = function() {
        // cache element
        this.$el = $('#'+ this.elId);
        this.$title = $('#title');
        this.$todolist = $('#todolist');

        this.$loader = this.$el.find('.loader'); // TODO, add context
        this.$list = this.$el.find('.list'); // TODO add context
        this.$detailContainer = this.$el.find('.detail-container');
        this.$detail = this.$el.find('.detail');
        this.$nextBtn = this.$el.find('.next-btn');
    };

    View.prototype._bindEvents = function() {
        var self = this;
        this.$detailContainer.find('.detail-close').on('click', function(){
            self.$detailContainer.removeClass('show');
        });
    };

    // extract id from url, hmm, the only way to get id :-/
    View.prototype._getId = function(str) {
        var segments = str.split('/');
        var id = segments[segments.length-2];
        return id;
    };

    // extract resource name from url
    View.prototype._getResource = function(str) {
        var segments = str.split('/');
        var resource = segments[segments.length-3];
        return resource;
    };

    View.prototype._updateTitle = function(title) {
        this.$title.html(title);
    };

    View.prototype._addTodo = function(itemText) {
        this.$todolist.append('<li>'+itemText+'</li>');
    };


    View.prototype._isScrolledIntoView = function(el) {
            var top = el.getBoundingClientRect().top, rect, el = el.parentNode;
            do {
                rect = el.getBoundingClientRect();
                if (top <= rect.bottom === false)
                    return false;
                el = el.parentNode;
            } while (el != document.body);
            // Check its within the document viewport
            return top <= document.documentElement.clientHeight;
    }

    // binder
    View.prototype.onAddTodo = function(handler) {
        //handler();
    };


    View.prototype.onNextPage = function(handler) {
        var self = this;
        this.$nextBtn.on('click',function() {
            handler();
        });

        this.$el.find('.list-container').scroll(function(){
            if (self._isScrolledIntoView(self.$nextBtn[0])) {
                handler();
            }
        });

    };

    // renderer
    View.prototype.renderList = function(data) {
        var i, str='', url, id;
        if (!data.length) return false;

        for (i=0; i< data.length; i++) {
            id = this._getId(data[i].url);
            url = '#/'+this._getResource(data[i].url)+'/'+id;
            str += '<li><a href="'+url+'">' + (data[i].title || data[i].name) +'</a></li>';
        }
        this.$list.append(str);

        this.$el.find('.list-container').trigger('scroll');

    };

    View.prototype._labelToType = function(label) {
      if (label === 'pilots' || label === 'characters' || label === 'residents') {
          return 'people';
      } else if (label === 'homeworld') {
          return 'planets';
      //} else if (label === 'characters') {
      //    return '';
      } else {
          return label;
      }
    };

    View.prototype._formatValue = function(prop,value) {
        var self = this, i, arr = [], obj = {};

        // wrap all resources as array, for easier conversion
        if (/*prop === 'people' || */prop === 'homeworld') {
            if (typeof value !== 'array') {
                value = [ value ];
            }
        }
        if (prop === 'films' || prop === 'vehicles' || prop === 'starships' || prop === 'species' || prop === 'homeworld' || prop === 'pilots' || prop === 'people' || prop === 'characters' || prop === 'residents' || prop === 'planets') {
            if (value.length == 0) return 'N/A';
            //return typeof value;
            for (i=0; i<value.length; i++)
            {
                obj = {
                    'type' : self._labelToType(prop),
                    'id'   : self._getId(value[i]),
                    'value' : value[i]
                };
                arr.push(obj);
            }
            return { collections: arr };
        }

        return value;
    };

    View.prototype.renderDetail = function(id,data) {
        if (!data) return false;
        var self = this;
        //this.$detail.html('<p>name='+data.name+'</p>');

        // prepare data for template
        var detailData = { 'detail':[], 'res': self.elId, 'resId': id }, prop;
        for (prop in data) {
            // filter data to be displayed
            if (data.hasOwnProperty(prop) && prop !== 'created' && prop !== 'edited' && prop !== 'url') {
                detailData['detail'].push({
                    'label' : prop.replace(/_/g,' '),
                    'value' : self._formatValue(prop,data[prop])
                });
            }
        }

        // todo, move this to cacheTemplate function and use parse
        var template = $('#detail-template').html();
        this.$detail.html(Mustache.render(template,detailData));

        // transform resources
        //this.getCurrentDetailCards();
    };

    View.prototype.getCurrentDetailCards = function () {
        var cards = [], card;
        this.$detail.find('.card').each(function(){
            card = {
                type: $(this).data('resource-type'),
                id : $(this).data('resource-id'),
                el : $(this).prop('id')
            }
            cards.push(card);
        });
        return cards;
    };

    View.prototype.updateCard = function(el,text) {
        this.$detail.find('#'+el+' a').html(text);
    };

    View.prototype.renderLoader = function(option) {
        if (option === 'show') {
            this.$loader.show();
        } else if (option === 'hide') {
            this.$loader.hide();
        }
    };

    View.prototype.show = function() {
        this.$el.show();
    };

    View.prototype.showDetail = function() {
        this.$detailContainer.addClass('show');
    };

    window.app = window.app || {};
    window.app.View = View;
}(window,Zepto,Mustache));