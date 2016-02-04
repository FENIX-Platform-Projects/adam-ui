define([
    'models/base/model'
], function(Model) {
    'use strict';

    var Indicator = Model.extend({
        type: "Indicator"
    });

    return Indicator;
});