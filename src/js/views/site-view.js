/*global define, amplify*/
define([
    'jquery',
    'chaplin',
    'underscore',
    'config/Config',
    'config/Events',
    'globals/State',
    'views/base/view',
    'fx-menu/start',
    'globals/AuthManager',
    'i18n!nls/site',
    'text!templates/site.hbs'
], function ($, Chaplin, _, C, E, State, View, Menu, AuthManager, i18nLabels, template) {

    'use strict';

    var s = {
        TOP_MENU_CONTAINER: '#top-menu-container',
        BREADCRUMB_CONTAINER: "#breadcrumb-container",
        FOOTER_MENU_CONTAINER: "#footer-menu-container"
    };

    var SiteView = View.extend({

        container: '.fx-sandbox',

        id: 'site-container',

        regions: {
            main: '#main-container',
            breadcrumb: s.BREADCRUMB_CONTAINER
        },

        template: template,

        getTemplateData: function () {
            return $.extend(true, {}, C, i18nLabels);
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            this.bindEventListeners();

            this.initComponents();
        },

        bindEventListeners: function () {
            amplify.subscribe(E.STATE_CHANGE, this, this.onStateUpdate);
        },

        initComponents: function () {

                var self = this,
                    menuConf = {

                        url: C.TOP_MENU_CONFIG,

                        template: C.TOP_MENU_TEMPLATE,

                        //active: State.menu,
                        container: s.TOP_MENU_CONTAINER,
                        callback: _.bind(this.onMenuRendered, this),
                        breadcrumb: {
                            active: C.TOP_MENU_SHOW_BREADCRUMB,
                            container: s.BREADCRUMB_CONTAINER,
                            showHome: C.TOP_MENU_SHOW_BREADCRUMB_HOME
                        }//,
                       // footer: {
                       //     active: C.TOP_MENU_SHOW_FOOTER,
                       //     container: s.FOOTER_MENU_CONTAINER
                       // }
                    },
                    menuConfAuth = _.extend({}, menuConf, {
                        hiddens: C.TOP_MENU_AUTH_MODE_HIDDEN_ITEMS
                    }),
                    menuConfPub = _.extend({}, menuConf, {
                        hiddens: C.TOP_MENU_PUBLIC_MODE_HIDDEN_ITEMS
                    });

                /**this.authManager = AuthManager.init({
                    onLogin: _.bind(function () {
                        self.topMenu.refresh(menuConfAuth);
                    }, this),
                    onLogout: _.bind(function () {
                        Chaplin.mediator.publish(E.NOT_AUTHORIZED);
                        self.topMenu.refresh(menuConfPub);
                    }, this)
                });  **/


            this.authManager = AuthManager.init({
                modal : {
                    keyboard: false,
                    backdrop: 'static'
                },
                onLogin: _.bind(function () {
                    Chaplin.utils.redirectTo({controller: State.menu, action: 'show'});
                    this.topMenu = new Menu(true ? menuConfAuth : menuConfPub);
                }, this),
                onLogout: _.bind(function () {
                    Chaplin.utils.redirectTo({controller: State.menu, action: 'show'});
                    this.topMenu = new Menu(false ? menuConfAuth : menuConfPub);
                }, this)
            });

            //Top Menu
            this.topMenu = new Menu(this.authManager.isLogged() ? menuConfAuth : menuConfPub);

        },

        onMenuRendered: function () {

            this.onMenuUpdate();

            this.onMenuAddBreadcrumb();

            amplify.subscribe(E.MENU_UPDATE, this, this.onMenuUpdate);
            amplify.subscribe(E.MENU_ADD_BREADCRUMB, this, this.onMenuAddBreadcrumb);
            amplify.subscribe(E.MENU_RESET_BREADCRUMB, this, this.onMenuResetBreadcrumb);
        },

        onStateUpdate: function (s) {
            State = $.extend(true, State, s);

            amplify.publish(E.MENU_UPDATE);
            amplify.publish(E.MENU_ADD_BREADCRUMB);
        },

        onMenuUpdate: function () {
           this.topMenu.select(State.menu);
        },

        onMenuAddBreadcrumb: function () {
            if(State.breadcrumb!= null){
                this.topMenu.appendBreadcrumbItem(State.breadcrumb, true);
            }
        },

        onMenuResetBreadcrumb: function () {
          //  console.log("========================= Breadcrumb reset");
            if(State.breadcrumb!= null){
                this.topMenu.resetBreadcrumb();
                State.breadcrumb = null;
            }
        }

    });

    return SiteView;
});
