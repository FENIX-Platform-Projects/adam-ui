define([
    'models/base/model'
], function(Model) {
    'use strict';

    var Dashboard = Model.extend({
        type: "Dashboard"
    });

    return Dashboard;
});