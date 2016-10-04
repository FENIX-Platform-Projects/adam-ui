define([
    'jquery',
    'require',
    'underscore',
    'i18n!nls/filter',
    'text!templates/common/filters-error.hbs',
    'handlebars'
], function ($, require, _, i18nLabels, template, Handlebars) {

    'use strict';

    var defaultOptions = {lang: "EN"},
        s = {ERRORS: "#filter-errors",  COLLAPSE: "collapse", SPAN: "span", STRONG: "strong"};

    function FilterValidator(o) {
        $.extend(true, this, {initial: o}, defaultOptions);

        this._parseInput(o);

        this._renderTemplate();

        return this;
    }


    /**
     * Checks that there is a value for each filter item
     * @returns missing values message or true if valid
     * @private
     */
    FilterValidator.prototype.validateValues = function (values) {
        var valid = true,
            missing = [];

        for(var id in values){
            if(values[id].length === 0){
                var label = i18nLabels["filter_"+id];
                missing.push({code: id, label: label});
            }
        }

        return missing.length > 0 ? this._createMessage(missing) : valid;
    };


    /**
     * Collapse/Hide the Error section by adding the 'collapse' CSS class
     * @private
     */
    FilterValidator.prototype.hideErrorSection = function (itemId) {
        this.$el.find(s.ERRORS).addClass(s.COLLAPSE);
    };

    /**
     * Expand/Show the Error section by removing the 'collapse' CSS class and setting the html content
     * @private
     */
    FilterValidator.prototype.displayErrorSection = function (message) {
        this.$el.find(s.ERRORS).removeClass(s.COLLAPSE);
        this.$el.find(s.ERRORS + ' '+s.STRONG +' '+s.SPAN).html(message);
    };

    /**
     * Returns concatenated string of the missing items
     * @returns message
     * @private
     */
        FilterValidator.prototype._createMessage = function (missingvalues) {
        var message = "";

        for(var idx in missingvalues){

            message += missingvalues[idx].label;

            if(idx == missingvalues.length-2) {
                message+= " "+i18nLabels.and+" ";
            } else if (idx < missingvalues.length-1) {
                message +=  " , ";
           }

        }

        return message;
    };


    FilterValidator.prototype._renderTemplate = function () {
        this.template = Handlebars.compile(template);

        var html = this.template(i18nLabels);

        this.$el.html(html);
    };

    FilterValidator.prototype._parseInput = function () {

        this.el = this.initial.el || window.document;

        this.$el = $(this.el);

    };

    return FilterValidator;
});