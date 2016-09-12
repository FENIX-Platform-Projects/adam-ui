/*global define, Promise, amplify */

define([
    "jquery",
    "loglevel",
    'underscore',
    'text!templates/common/progress-bar.hbs',
    'lib/utils',
    'i18n!nls/common',
    'handlebars',
    'amplify'
], function ($, log, _, template, Utils, i18nLabels, Handlebars) {

    'use strict';

    var defaultOptions = {
        id: '#progress-bar'
    };

    function ProgressBar(o) {

        var self = this;

        $.extend(true, this, defaultOptions, o);
        this.$container = $(this.container);

        this._renderTemplate();

        this._render();

        return this;
    }

    ProgressBar.prototype._renderTemplate = function () {

        this.progressBar = Handlebars.compile(template);

    };

    ProgressBar.prototype._render = function () {
        var html = this.progressBar;
        $(this.container).html(html);
    };


    ProgressBar.prototype.update = function (value) {

        this.$el = this.$container.find(this.id);

        var $div = this.$el.find('div');

        var $span = $div.find('span');

        $div.attr('aria-valuenow', value);
        $div.css('width', value + '%');

        if(value !== 0) {
            $span.text(' '+ i18nLabels.loading_in_progress + ' ... '+ value + '% '+i18nLabels.completed);
        }

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