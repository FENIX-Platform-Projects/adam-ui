/*global define, requirejs*/
define([
    'handlebars',
    'underscore',
    'chaplin'
], function (Handlebars, _, Chaplin) {

    'use strict';

    // Application-specific utilities
    // ------------------------------

    // Delegate to Chaplin’s utils module
    var utils = Chaplin.utils.beget(Chaplin.utils);

    // Add additional application-specific properties and methods

    // _(utils).extend({
    //   someProperty: 'foo',
    //   someMethod: function() {}
    // });

    Handlebars.registerHelper('isI18n', function (keyword) {

        if (typeof keyword === 'object') {

            var lang = requirejs.s.contexts._.config.i18n.locale;
            return keyword[lang.toUpperCase()];
        }
        else {
            return keyword;
        }
    });

    Handlebars.registerHelper('grouped_each', function(every, context, options) {
        var out = "", subcontext = [], i;
        if (context && context.length > 0) {
            for (i = 0; i < context.length; i++) {
                if (i > 0 && i % every === 0) {
                    out += options.fn(subcontext);
                    subcontext = [];
                }
                subcontext.push(context[i]);
            }
            out += options.fn(subcontext);
        }
        return out;
    });

    Handlebars.registerHelper('i18n', function (keyword) {

        var lang = requirejs.s.contexts._.config.i18n.locale;

        return keyword[lang.toUpperCase()];
    });


    utils.getLabel = function (obj) {
        return obj[requirejs.s.contexts._.config.i18n.locale.toUpperCase()];
    };

    utils.sortArray = function (prop, arr) {
        prop = prop.split('.');
        var len = prop.length;

        arr.sort(function (a, b) {
            var i = 0;
            while( i < len ) { a = a[prop[i]]; b = b[prop[i]]; i++; }
            if (a < b) {
                return -1;
            } else if (a > b) {
                return 1;
            } else {
                return 0;
            }
        });
        return arr;
    };

    return utils;
});
