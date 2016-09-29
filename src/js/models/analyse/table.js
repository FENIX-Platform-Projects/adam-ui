define([
    'models/base/model'
], function(Model) {
    'use strict';

    var Table = Model.extend({
        type: "Table"
    });

    return Table;
});