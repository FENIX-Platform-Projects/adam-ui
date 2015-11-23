/*global define*/
define([
    'chaplin',
    'controllers/base/controller',
    'views/analyze-view',
    'rsvp',
    'globals/AuthManager'
], function (Chaplin, Controller, View, RSVP, AuthManager) {
    'use strict';

    var AnalyzeController = Controller.extend({


/*        beforeAction: function () {
            Controller.prototype.beforeAction.call(this, arguments);

            return this.performAccessControlChecks().then(undefined, _.bind(this.denyAccessControl, this))
        },

        performAccessControlChecks: function () {

            return new RSVP.Promise(function (fulfilled, rejected) {

                if (!AuthManager.isLogged()) {
                fulfilled();
            });
        },

        denyAccessControl: function () {
            this.authorized = false;
        },*/

        show: function (params) {

/*            if (this.authorized === false) {
                Chaplin.utils.redirectTo({controller: 'login', action: 'show'});
                return;
            }*/


            // USE fx-menu: for breadcrumbs
            //FM.prototype.addItemsToBreadcrumb = function (path);

            this.view = new View({
                region: 'main',
                filter: params.filter,
                page: Backbone.history.fragment
            });
        }
    });

    return AnalyzeController;
});
