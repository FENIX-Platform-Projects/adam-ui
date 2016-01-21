/*global define,amplify*/

define([
    "jquery",
    'bootstrap',
    'amplify'
], function ($) {

    'use strict';

    var o = { },
        defaultOptions = {
            widget: {
                lang: 'EN'
            }
        },
        css = {
            TITLE_LIST: 'fx-title-list',
            BREADCRUMB: 'breadcrumb',
        },
        events = {
             ADD_ITEM: 'fx.title.item.add',
             REMOVE_ITEM: 'fx.title.item.remove',
             DESELECT_ITEM: 'fx.title.item.deselect'
        }

    function Fx_Title_Bar() {

    }

    Fx_Title_Bar.prototype.init = function (options) {
        //Merge options
        $.extend(o, defaultOptions, options);

    };

    Fx_Title_Bar.prototype.render = function () {
        this.bindEventListeners();
        this.$titlelist = $('<ol class="'+css.TITLE_LIST+' '+css.BREADCRUMB+'" data-role="list"></ol>');
        $(o.container).append(this.$titlelist);
    };

    Fx_Title_Bar.prototype.bindEventListeners = function () {
        amplify.subscribe(events.ADD_ITEM, this, this.onReady);
        amplify.subscribe(events.REMOVE_ITEM, this, this.onRemove);
    };

    Fx_Title_Bar.prototype.onReady = function (e){
        this.addItem(e);
    };

    Fx_Title_Bar.prototype.onRemove = function (e){
        this.removeItem(e.name);
    };

    Fx_Title_Bar.prototype.unbindEventListeners = function () {

        amplify.unsubscribe(events.ADD_ITEM, this.onReady);
        amplify.unsubscribe(events.REMOVE_ITEM, this.onRemove);
    };

    Fx_Title_Bar.prototype.removeItem = function (item) {
        this.findItem(item).remove();
    };

    Fx_Title_Bar.prototype.addItem = function (item) {
        this.printItems(this.$titlelist, item);
 };

    Fx_Title_Bar.prototype.printItems = function ($container, item) {
        $container.append(this.getItem(item));
    };

    Fx_Title_Bar.prototype.getItem = function(item ){
        var $obj = $('<li class="fx-title-item" data-module="' + item.name + '" style="display:none">'+ item.text +'</li>');
        return $obj;
    };


    Fx_Title_Bar.prototype.findAndReplaceDuplicatedModules = function(){
        // Check if there is more than 1 list item that has the same data-module
        // If so, then the first matching item's text should be updated with the 'next' matching item's text value
        // Then the 'next' item should be removed from the list

        this.$titlelist.find('[data-module]').each(function() {
            var matchingItemsArr = $('[data-module=' + $(this).attr('data-module') + ']');
            if (matchingItemsArr.length > 1) {
                var nextItemText = matchingItemsArr.not(':first').text(); // This is the 'next' item in the array (so by definition it has the latest value for the data-module)
                // Get the first item and set the text
                $(matchingItemsArr[0]).text(nextItemText);
                // Remove the 'next' item
                matchingItemsArr.not(':first').remove();
            }
        });
    };

    Fx_Title_Bar.prototype.showItems = function(){

        this.findAndReplaceDuplicatedModules();

        this.$titlelist.find('li').each(function(){
           $(this).show();
        });

    };

    Fx_Title_Bar.prototype.findItem = function (module) {
        return this.$titlelist.find('[data-module="' + module + '" ]');
    };


    Fx_Title_Bar.prototype.destroy = function () {
        this.unbindEventListeners();
    };

    return Fx_Title_Bar;

});