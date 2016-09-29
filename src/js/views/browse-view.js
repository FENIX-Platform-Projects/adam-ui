/*global define, amplify*/
define([
    'views/base/view',
    'text!templates/common/modules.hbs',
    'i18n!nls/browse-modules',
    'config/Events',
    'handlebars',
    'amplify'
], function (View, modulesTemplate, moduleLabels, E) {

    'use strict';

    var BrowseView = View.extend({

        // Automatically render after initialize
        autoRender: true,

        className: 'analysis',

        // Save the template string in a prototype property.
        // This is overwritten with the compiled template function.
        // In the end you might want to used precompiled templates.
        template: modulesTemplate,

        initialize: function (params) {
             this.page = params.page;

            View.prototype.initialize.call(this, arguments);
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            //remove Breadcrumbs
            amplify.publish(E.MENU_RESET_BREADCRUMB);

            //update State
            amplify.publish(E.STATE_CHANGE, {menu: 'browse'});

            //console.log("BROWSE OPTIONS =========");
            this._displayBrowseOptions() ;

        },

        _displayBrowseOptions: function () {
            var html = this.template({modules: moduleLabels["modules"]});

           this.$el.html(html);
        }

   });

    return BrowseView;
});
