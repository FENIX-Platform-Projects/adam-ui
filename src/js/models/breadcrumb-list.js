define([
    'models/base/collection',
    'models/breadcrumb'
], function(Collection, Model) {
    'use strict';

    var BreadcrumbList = Collection.extend({
        model: Model
    });

    return BreadcrumbList;
});
