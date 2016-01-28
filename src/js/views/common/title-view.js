/*global define, amplify*/
define([
    'jquery',
    'views/base/view',
    'text!templates/common/title.hbs',
    'handlebars',
    'amplify'
], function ($, View, template) {

    'use strict';

    var s = {
        css_classes: {
            TITLE_ITEMS_LIST: "#fx-title-items-list"
        },
        events: {
            ADD_ITEM: 'fx.title.item.add',
            REMOVE_ITEM: 'fx.title.item.remove'
        }
    };

    var TitleView = View.extend({

        // Automatically render after initialize
        autoRender: true,

        className: 'title-bar',

        // Save the template string in a prototype property.
        // This is overwritten with the compiled template function.
        // In the end you might want to used precompiled templates.
        template: template,

        initialize: function () {
            View.prototype.initialize.call(this, arguments);
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            this._initVariables();

            this._bindEventListeners();

        },

        show : function(){
            this._cleanUpDuplications();

            this.$titleItemsList.find('li').each(function(){
                $(this).show();
            });

        },

        _cleanUpDuplications: function(){
        // Check if there is more than 1 list item that has the same data-module
        // If the check is true, then there will only be 2 items - 1 visible and 1 hidden item
        // If true: the first hidden item's text should be stored and then the hidden item removed
        // The stored text value is used to replace the text of the remaining item in the array

            this.$titleItemsList.find('[data-module]').each(function() {
            var matchingItemsArr = $('[data-module=' + $(this).attr('data-module') + ']');

            if (matchingItemsArr.length > 1) {
                var replacementText = "";

                for (var i = 0; i < matchingItemsArr.length; i++) {
                    if ( $(matchingItemsArr[i]).is(':hidden')) {
                        replacementText = $(matchingItemsArr[i]).text(); // store hidden item's text value
                        matchingItemsArr[i].remove(); // remove hidden item
                        break;
                    }
                }

                // Get the first item and set the replacement text
                $(matchingItemsArr[0]).text(replacementText);

            }
        });
    },


    _initVariables: function () {
            this.$titleItemsList = this.$el.find(s.css_classes.TITLE_ITEMS_LIST);
        },

        _bindEventListeners: function () {
            amplify.subscribe(s.events.ADD_ITEM, this, this._onAdd);
            amplify.subscribe(s.events.REMOVE_ITEM, this, this._onRemove);
        },

        _onAdd: function (e) {
            this._addItem(e);
        },

        _onRemove: function (e) {
            this._removeItem(e.name);
        },

        _addItem: function (item) {
           this._updateList(item);
        },

        _removeItem: function (name) {
            this._findListItem(name).remove();
        },

        _addToList: function (item) {
            this.$titleItemsList.append(this._createListItem(item));
        },

        _findListItem: function(name) {
            return  this.$titleItemsList.find('[data-module="' + name + '" ]');
        },

        _findHiddenItem: function(name) {
            var hiddenItems = this.$titleItemsList.find('[data-module="' + name + '" ]').filter(':hidden');

            if(hiddenItems.length > 0) {
              return hiddenItems;
            }
        },

        _replaceListItemText: function(item, replace) {
             item.text(replace.text)
        },

        _updateList: function (item) {
            var hiddenItem = this._findHiddenItem(item.name);

            if(hiddenItem) {
                this._replaceListItem(hiddenItem, item);
            }
            else
                this._addToList(item)

        },

        _createListItem: function (item) {
          return $('<li data-module="' + item.name + '" style="display:none">'+ item.text +'</li>');
        },

        _replaceListItem: function (find, item) {
          this._replaceListItemText(find, item);
        },

        _unbindEventListeners: function () {
            // Remove listeners
            amplify.unsubscribe(s.events.ADD_ITEM, this._onAdd);
            amplify.unsubscribe(s.events.REMOVE_ITEM, this._onRemove);
        },

        dispose: function () {
            this._unbindEventListeners();
            View.prototype.dispose.call(this, arguments);
        }

    });

    return TitleView;
});
