/*global define*/
define([
    'chaplin',
    'controllers/base/controller',
    'views/browse-view',
    'views/breadcrumb-list-view',
    'models/breadcrumb',
    'models/breadcrumb-list',
    'rsvp',
    'globals/AuthManager'
], function (Chaplin, Controller, View, BreadcrumbListView, BreadcrumbModel, BreadcrumbList, RSVP, AuthManager) {
    'use strict';

    var BrowseController = Controller.extend({


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



            //var breadcrumbModel = new BreadcrumbModel({name : 'Browse Data ',link : '#browse'});
            //var breadcrumbModel2 = new BreadcrumbModel({name : 'By '+params.filter,link : '#browse/'+params.filter});

            //var breadcrumbList = new BreadcrumbList([breadcrumbModel, breadcrumbModel2]);

           // this.breadcrumbListView = new BreadcrumbListView(
             //   {
               //     region: 'main',
                //    collection:  breadcrumbList
               // }
           // );

            this.view = new View({
                region: 'main',
                filter: params.filter,
               breadcrumb: 'Browse Data / '+params.filter
            });
        }
    });

    return BrowseController;
});
