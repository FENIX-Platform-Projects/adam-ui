/*global define*/
define([
    'chaplin',
    'controllers/base/controller',
    'views/profiles-view',
    'rsvp',
    'globals/AuthManager'
], function (Chaplin, Controller, PartnerProfilesView) {
    'use strict';

    var PartnerProfilesController = Controller.extend({

        show: function (params) {
            this.view = new PartnerProfilesView({
                region: 'main',
                page: Backbone.history.fragment
            });
        }

    });

    return PartnerProfilesController;
});
