/*global define, amplify*/
define([
    'jquery',
    'underscore',
    'loglevel',
    'views/base/view',
    'text!templates/analyze/compare/selectors.hbs',
    'i18n!nls/analyze',
    'config/Events',
    'config/Config',
    'config/analyze/compare/Config',
    'q',
    'amplify'
], function ($, _, log, View, template, i18nLabels, E, GC, AC, Q) {

    'use strict';

    var s = {

    };

    var SelectorView = View.extend({

        // Automatically render after initialize
        autoRender: true,

        className: 'analyze-compare-selectors',

        template: template,

        initialize: function (params) {

            View.prototype.initialize.call(this, arguments);
        },

        getTemplateData: function () {
            return i18nLabels;
        },

        _bindEventListeners: function () {

        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            this._initVariables();

            this._bindEventListeners();

            this._preloadResources().then(
                _.bind(this._onPreloadResourceSuccess, this),
                _.bind(this._onPreloadResourceError, this)
            );

        },

        _initVariables: function () {

            //Codelists
            this.cachedCodelist = {};

            this.codelists = Object.keys(AC.cd);

            log.info("Codelists found in config: " + this.codelists);

        },

        _preloadResources : function (){

            var promises = [];

            log.info("Preloading codelist");

            _.each(this.codelists, _.bind(function (cd) {

                //Check if codelist is cached otherwise query
                var stored = amplify.store.sessionStorage(cd);

                if (stored === undefined || stored.length < 2) {

                    log.info(cd + " not in session storage.");

                    promises.push(this._createPromise(cd));
                }

            }, this));

            return Q.all(promises);

        },

        _createPromise: function (cl) {

            var self = this,
                body = AC.cd[cl];

            return Q($.ajax({
                url: GC.SERVER + GC.CODES_POSTFIX ,
                type: "POST",
                contentType: "application/json",
                data : JSON.stringify( body ),
                dataType: 'json'
            })).then(function (result) {

                console.log(result)

                if (typeof result === 'undefined') {
                    log.info("No Code List loaded for: " + cl);
                }

                self.cachedCodelist[cl] = result[0].children;

            }, function (r) {

                log.error(r);
            });
        },

        _onPreloadResourceSuccess : function () {
            log.info("Resources loaded");
            log.info( this.cachedCodelist)

        },

        _onPreloadResourceError : function () {
            log.error("Resources load: error");
        }


    });

    return SelectorView;
});
