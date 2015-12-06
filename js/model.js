(function (window, $){
    'use strict';

    /*
    *  Model 'class'
    *
    * */
    function Model(config) {
        this._cache = config.cache || [];
        this.enableCache = config.enableCache || true;
        this.resource = config.resource || 'vehicles';
        this.baseApi = config.baseApi || 'http://swapi.co/api/';
        this.api = this.baseApi+this.resource;
        this.data = [];
        this.currentPage = 0; // last obtained page
        this.noMorePage = false;
        this.lock = false;
    }

    // extract id from url, hmm, the only way to get id :-/
    Model.prototype._getId = function(str) {
        var segments = str.split('/');
        var id = segments[segments.length-2];
        return id;
    };

    // index, parameter = page, default = 1
    // get, parameter = id

    // input = ajax response data
    // output = array of ids of data
    Model.prototype.saveAjaxResponseToModel = function(data,cachePath,page) {
        var self = this;
        self.enableCache && (self._cache[cachePath] = data);

        var isSingle = !data.results;

        // put data into model
        // collections
        var i, id, newIds = [];
        if (!isSingle) {
            for (i=0; i< data.results.length; i++) {
                id = self._getId(data.results[i].url);
                self.data[id] = data.results[i];
                data.results[i].id = id;
                newIds.push(id);
            }
        } else {
            // single data
            id = self._getId(data.url);
            self.data[id] = data;
            data.id = id;
            newIds.push(id);
        }

        if (page) {
            self.currentPage = page;
        }

        return newIds;
    };

    // successHandler parameter = new ids
    Model.prototype._obtain = function(param, successHandler, errorHandler, qs, async, throwModel) {
        param = param || 1;
        var self = this,
            path = qs ? '/?'+qs+'='+param : '/'+param,
            cachePath = this.resource+path,//qs ? qs+param : param,
            cachedData = this._cache[cachePath],
            isSingle = !qs, // if no querystring supplied, then assume the requested data is single
            page = (!isSingle && param) || false;

        if (async !== true && self.lock) {
            //return undefined;
        }

        self.lock = true;

        // single data
        // check whether requested data already in model data
        if (isSingle && typeof self.data[param] === 'object') {
            successHandler([ param ], (throwModel && self.data) || false);
            self.lock = false;
            return undefined;
        }

        // if not, need to request to API, but lets check cache first
        if (cachedData) {
            var resultIds = self.saveAjaxResponseToModel(cachedData,cachePath);
            successHandler(resultIds, (throwModel && self.data) || false);
            self.lock = false;
            return undefined;
        }

        // ajax call to api
        $.ajax({
            url: self.api + path,
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                self.lock = false;
                var resultIds = self.saveAjaxResponseToModel(data,cachePath,page);
                successHandler(resultIds, (throwModel && self.data) || false);

            },
            error: function(xhr, textStatus) {
                self.lock = false;
                // naive assumption for end of list, if receiving 404.. need to be improved for more accurate
                if (xhr.status == 404) {
                    self.noMorePage = true;
                }
                errorHandler(textStatus);

            }
        });
    };

    Model.prototype.index = function(page, successHandler, errorHandler) {
        this._obtain(page, successHandler, errorHandler, 'page' );
    };

    Model.prototype.getNextPage = function(successHandler, errorHandler) {
        this._obtain(this.currentPage+1, successHandler, errorHandler, 'page' );
    };

    Model.prototype.get = function(id, successHandler, errorHandler, async, throwModel) {
        this._obtain(id, successHandler, errorHandler, false, async, throwModel );
    };


    window.app = window.app || {};
    window.app.Model = Model;
}(window,Zepto));