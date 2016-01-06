/*global define*/
define(function () {

    'use strict';

    var RECIPIENT = "Country / Region",
        DONOR = "Donor",
        DELIVERY = "Channel of delivery",
        SECTOR = "Sector",
        SUB_SECTOR = "Sub-Sector";

    return {

        "recipient" : RECIPIENT,
        "donor" : DONOR,
        "delivery" : DELIVERY,
        "sector" : SECTOR,
        "sub-sector" : SUB_SECTOR,

        "title": "Analyze Data / Compare",
        "collapse_btn": "Collapse / Expand this panel",
        "compare_btn": "Compare",
        "reset_btn": "Reset",
        "clear_all_btn": "Clear All",
        "search_placeholder": "Filter",

        "sel_heading_country": RECIPIENT,
        "sel_heading_donor": DONOR,
        "sel_heading_oda": "Official Development Assistance (ODA)",
        "sel_heading_year": "Year",
        "sel_heading_compare_by": "Compare by",
        "sel_heading_channel_of_delivery": DELIVERY,
        "sel_heading_sector": SECTOR,
        "sel_heading_sub_sector": SUB_SECTOR,
        "sel_country_tab_countries": "Countries",
        "sel_country_tab_regions": "Regions",
        "sel_country_tab_regional_aggregation": "Regional Aggregation",

        "expectedResult": "Expected results",

        "year_form": "From",
        "year_to": "To",

        "compare_as": "Compare as",
        "tab_chart": "Chart",
        "tab_table": "Table",
        "result_error": "Aw snap! There was a problem loading this resource",

        "show_advanced_options": "Show advanced options",

        "reload": "Reload"

    }
});