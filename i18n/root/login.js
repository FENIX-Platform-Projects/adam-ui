/*global define*/
define([
    'jquery',
    'i18n!nls/common'
], function ($, Common) {

    'use strict';

    return $.extend(true, {}, Common, {

        "home_welcome_title": "Welcome to " + Common["project_name"],
        "text": "Change me in i18n/root/home.js",
        "authentication_credentials": "login username/password: guest@fenix/guest",
        home_partner_fra: " The FAO Global Forest Resources Assessment organizes, collects, analyzes and distributes a broad range of forest resource data in close collaboration with a network of National Correspondents who prepare reports based on a standard online questionnaire.  The first assessment was published in 1948 and is now conducted every five years.",
        home_partner_fe: "FOREST EUROPE (The Ministerial Conference on the Protection of Forests in Europe) is the pan-European political process for the sustainable management of the continent’s forests. ",
        home_partner_unece: "UN Economic Commission for Europe: We monitor the state of forests in the region, help in developing evidence-based policies for sustainable forest management, communicate about the many products and ecosystem services provided to society and assist countries to monitor and manage forests",
        home_partner_mp: "The Montreal Process: The Montreal Process, through its Criteria and Indicators of Sustainable Forest Management provides its member countries with an internationally agreed, locally supported tool to integrate issues as they apply to forests.",
        home_partner_ofac: "Observatoire des Forets dÁfrique Centrale (OFAC). The overall objective of OFAC is to support the Central African Forest Commission to manage the forests of Central Africa in a sustainable manner.",
        home_partner_itto: "ITTO: The International Tropical Timber Organization (ITTO) collects, analyzes and disseminates data on the production and trade of tropical timber and funds projects and other actions aimed at developing industries at both the community and industrial scales."

    });

});