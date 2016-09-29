/*global define, requirejs*/
define([
    'jquery',
    'underscore'
], function ($, _) {

    'use strict';

    function ConfigUtils() {
         return this;
    }

    ConfigUtils.prototype.findById = function (json, id) {
        var found =  _.find(json, function(item){
            return item.id = id;
        });

        return found;
    };

    ConfigUtils.prototype.findByPropValue = function (json, prop, value) {
        var found =  _.find(json, function(item){
            if(item[prop] == value)
              return item;
        });

        return found;
    };

    ConfigUtils.prototype.process = function (parent, key, value, match, replace, keyvalue) {
         if(key === match && keyvalue){
             parent[replace] = keyvalue;
             delete parent[key];
         }
         if(value === match){
             parent[key] = replace;
         }
    };

    ConfigUtils.prototype.findAndReplace = function (o, match, replace, keyvalue) {
       for(var i in o){
        this.process(o, i, o[i], match, replace, keyvalue);
          if(o[i] !== null && (typeof (o[i]) =="object")){
            //step down into the object tree
          this.findAndReplace(o[i], match, replace, keyvalue)
        }
       }
    };

    ConfigUtils.prototype.objectContainsValue = function (o, value) {
        var hasValue = false;
        var allChildren = _.flatten(_.pluck(o,'codes'));

        var child = _.find(allChildren,function(child){
            if(child) {
                if (child.codes[0] == value){
                    return child;
                }
            }
        });

        if(child)
            hasValue = true;

        return hasValue;
    };


    return ConfigUtils;
});
