define([
    'models/base/model'
], function(Model) {
    'use strict';

    var Breadcrumb = Model.extend({
        defaults:{
            name        : '',
            link        : ''
        }
    });

    return Breadcrumb;
});
