/*global define*/
define(function () {
    'use strict';

    // The routes for the application. This module returns a function.
    // `match` is match method of the Router
    return function (match) {
        match('', 'home#show');
        match('home', 'home#show');
        //match('index', 'analysis#show');
        //   match('home', 'analysis#show');
        match('browse', 'browse#show');
        match('browse/:filter', 'browse#browseby');
        match('browse/:filter/:recipientcode', 'browse#browseby');
        match('analyse', 'analyse#show');
        match('analyse/priority_analysis', 'analyse#priority_analysis');
        match('analyse/compare', 'analyse#compare');
        match('analyse/partner_matrix', 'analyse#partner_matrix');
        match('analyse/comp_advantage', 'analyse#comp_advantage');

        // match('analyse/projects', 'analyse#projects');
        match('login', 'login#show');
        //  match('analysis', 'analysis#show');
        match('*anything', '404#show');
    };
});
