/*global define, amplify*/
define([
    'jquery',
    'underscore',
    'handlebars',
    'config/Config',
    'views/base/view',
    'text!templates/download/download.hbs',
    'text!templates/download/item.hbs',
    'text!config/download/download_by_topic.json',
    'text!config/download/download_by_category.json',
    'i18n!nls/download',
    'config/Events',
    'amplify'
], function ($, _, Handlebars, C, View, template, itemTemplate, jsonTopic, jsonCategory, i18nLabels, E) {

    'use strict';

    var s = {
        TOPIC_HOLDER: "#flude-download-by-topic-holder",
        CATEGORY_HOLDER: "#flude-download-by-category-holder"
    };

    var DownloadView = View.extend({

        // Automatically render after initialize
        autoRender: true,

        className: 'modules',

        // Save the template string in a prototype property.
        // This is overwritten with the compiled template function.
        // In the end you might want to used precompiled templates.
        template: template,

        getTemplateData: function () {
            return i18nLabels;
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            //update State
            amplify.publish(E.STATE_CHANGE, {menu: 'download'});

            this.initVariables();

            this.renderDownloadsByTopic();

            this.renderDownloadsByCategory()

        },

        initVariables: function () {

            this.$topicHolder = this.$el.find(s.TOPIC_HOLDER);

            this.$categoryHolder = this.$el.find(s.CATEGORY_HOLDER);
        },

        renderList: function ($container, collection) {

            var $ul = $('<ol class="list-unstyled">');

            _.each(collection, function (item) {

                var template = Handlebars.compile(itemTemplate);

                item.target = C.DOWNLOAD_FILE_SYSTEM_ROOT + item.target;

                $ul.append($(template(item)));

            });

            $container.append($ul);

        },

        renderDownloadsByTopic: function () {

            this.renderList(this.$topicHolder, JSON.parse(jsonTopic));
        },

        renderDownloadsByCategory: function () {

            var cat = JSON.parse(jsonCategory),
                self = this;

            _.each(cat, function (c) {

                self.renderCategory(c);
            });
        },

        renderCategory: function (c) {

            var $title = $("<h3>",
                { text: c.title.EN });

            this.$categoryHolder.append($title);

            this.renderList(this.$categoryHolder, c.items);

        }
    });

    return DownloadView;
});
