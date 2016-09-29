/*global define*/
define({
  "core": {
    "multiple": false,
    "data": [
      {
        "id": "demographic",
        "state": {
          "opened": true
        },
        "children": [
          {
            "id": "population"
          },
          {
            "id": "education"
          },
          {
            "id": "health"
          },
          {
            "id": "labour"
          }
        ]
      },
      {
        "id": "economics",
        "state": {
          "opened": true
        },
        "children": [
          {
            "id": "balance_of_payments"
          },
          {
            "id": "gdp"
          },
          {
            "id": "monetary_statistics",
            "state": {"disabled": true}
          },
          {
            "id": "financial_flows",
            "state": {"disabled": true}
          },
          {
            "id": "public_finance"
          },
          {
            "id": "debt",
            "state": {"disabled": true}
          },
          {
            "id": "inflation",
            "state": {"disabled": true}
          },
          {
            "id": "energy",
            "state": {"disabled": true}

          },
          {
            "id": "tourism",
            "state": {"disabled": true}
          },
          {
            "id": "infrastructure",
            "state": {"disabled": true}
          },
          {
            "id": "production",
            "children": [
              {
                "id": "agriculture_production",
                "state": {"disabled": true}
              },
              {
                "id": "mining_production",
                "state": {"disabled": true}
              }
            ],
            "state": {"disabled": true}
          }
        ]
      }
    ]
  },
  "state" : {
    "ttl" : 1
  },
  "plugins": [
    "wholerow"
  ]
});