/*global define, amplify*/
define([
    'views/base/view',
    'text!templates/home/home.hbs',
    'config/Events',
    'fx-m-c/start',
    'amplify'
], function (View, template, E, MapCreator) {

    'use strict';

    var s = {
        MAP_CONTAINER : "#home-map",
        DROPDOWN_CONTAINER : "#factsheet-select"
    };

    var HomeView = View.extend({

        autoRender: true,

        className: 'home',

        template: template,

        attach: function () {

            View.prototype.attach.call(this, arguments);

            //update State
            amplify.publish(E.STATE_CHANGE, {menu: 'home'});

            this._renderComponents();

        },

        _renderComponents: function () {

            this._renderDropdown();

            this._renderMap();
        },

        _renderDropdown : function () {

            this.$el.find(s.DROPDOWN_CONTAINER).on('change', function () {

               window.open(this.value, '_blank');

            });

        },

        _renderMap : function () {

            var self = this;

            this.mapCreator = new MapCreator();
            this.mapCreator.render({
                container: s.MAP_CONTAINER
            }).then(function () {

                $.get('submodules/fenix-ui-map-creator/tests/fenix/dataset/bangkok.json', function (model) {

                    self.mapCreator.addLayer(model, { colorramp: 'Greens' });
                    self.mapCreator.addCountryBoundaries();
                    self.mapCreator.addCountryLabels();
                });

            });
        }
    });

    return HomeView;
});
