/*global define*/
define({
	"rows":[],
	"cols":[],
	"vals":[
		"Value",
		"Flag"],
	"hiddenAttributes":["Value",
		"Flag","Unit"],
	/*"rows": [
		"Element",
		"Area",
		"Item"
	],
	"cols": ["Year"],
	"vals": [
		"Value",
		"Flag"
	],
	"hiddenAttributes":[
		"AreaCode",
		"ElementCode",
		"ItemCode",
		"Unit",
		"Value",
		"Flag",
		"VarOrder1",
		"VarOrder2",
		"VarOrder3",
		"VarOrder4"
	]
	,*/
	 "derivedAttributes": {"Unit":function(ret){return ""},"Flag":function(ret){return ""}},
	"InstanceRenderers":[{label:"Table",func:"Table"},{label:"line chart",func:"line chart"}],
	"InstanceAggregators":[{label:"Sum2",func:"Sum2"},{label:"Sum",func:"Sum"}],
	  "showAgg": false,
    "showRender": false,
    "showUnit": false,
    "showCode": false,
    "showFlags": false,
    "csvText": "ADAM",
    "cellRenderFunction": function (value, unit, flag, showUnit, showFlag) {
        var ret = "";

        ret += "<div class='result-value'>" + value + "</div>";

        if (showUnit) {
            ret += " [" + unit + "]";
        }

        if (showFlag && flag!="") {
            ret += "<div class='result-amount'>(" + flag + ")</div>";
        }

        return ret + "";
    }
}
);
/*define({
    "rows": [
        ["Indicator", "Indicator_Code"], ["Source_Type", "Source_Code"], ["Country", "Country_Code"],
        ["Qualifier", "Qualifier_Code"]
    ],
    "cols": ["Year"],
    "vals": [
        "Value", "Flag", "Unit"
    ],
    "hiddenAttributes": [
        "Value", "Flag", "Year_Code", "Unit"
    ],
    "InstanceRenderers": [
        {label: "Grid", func: "Table"},
		{label: "OLAP", func: "OLAP"},
		{label: "Area", func: "Area"}
    ],
    "InstanceAggregators": [
        {label: "SumUnit", func: "Sum2"}
    ],
    derivedAttributes: {},
    linkedAttributes: [["Qualifier", "Qualifier_Code"],
        ["Indicator_Code", "Indicator"],
        ["Source_Code", "Source"], ["Country", "Country_Code"]],
    "showAgg": false,
    "showRender": false,
    "showUnit": false,
    "showCode": false,
    "showFlags": true,
    "csvText": "RLM",
    "cellRenderFunction": function (value, unit, flag, showUnit, showFlag) {
        var ret = "";

        ret += "<div class='result-value'>" + value + "</div>";

        if (showUnit) {
            ret += " [" + unit + "]";
        }

        if (showFlag && flag!="") {
            ret += "<div class='result-amount'>(" + flag + ")</div>";
        }

        return ret + "";
    }
});
*/
