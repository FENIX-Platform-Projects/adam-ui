/*global define, Promise, amplify */

define([
    "jquery",
    "loglevel",
    'underscore',
    'lib/utils',
    'i18n!nls/browse',
    'handlebars',
    'amplify'
], function ($, log, _, Utils, i18nLabels, Handlebars) {

    'use strict';


    function ProgressBar(o) {

        var self = this;

        $.extend(true, this, {}, o);
        this.$el = $(this.el);


        return this;
    }

    ProgressBar.prototype.update = function (value) {

        var $div = this.$el.find('div');

        var $span = $div.find('span');

        $div.attr('aria-valuenow', value);
        $div.css('width', value + '%');
        $span.text(value + '% Complete');

    };

    ProgressBar.prototype.update = function (value) {

        var $div = this.$el.find('div');

        var $span = $div.find('span');

        $div.attr('aria-valuenow', value);
        $div.css('width', value + '%');
        $span.text(value + '% Complete');

    };


    ProgressBar.prototype.finish = function () {
        var self = this;

        this.update(100);

        setTimeout(function (){
           self.hide();
        }, 1500)

    };

    ProgressBar.prototype.reset = function () {
        this.update(0);
    };

    ProgressBar.prototype._dispose = function () {
        this._unbindEventListeners();
        this._destroyProgressBar();

    };

    ProgressBar.prototype.hide = function () {
        var $div = this.$el;
        $div.addClass("collapse");
    };

    ProgressBar.prototype.show = function () {
        var $div = this.$el;
        $div.removeClass("collapse");
    };

    ProgressBar.prototype._destroyProgressBar = function () {

        log.info("Destroyed Progress Bar: ");
    };

    return ProgressBar;

});