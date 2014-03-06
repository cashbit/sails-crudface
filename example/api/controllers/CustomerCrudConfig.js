{
    "prettyName"  : "Customer",
    
	"layout" : [
        {
          "section": "", "rows": [
            {"firstname":6, "lastname":6}
          ]
        },
        {
          "section": "", "rows": [
            {"contacts":12}
          ]
        }
    ],

    "fieldsConfig": [
        {"name": "firstname", "ines": "ines", "type": "text", "inname":true},
        {"name": "lastname", "ines": "ines", "type": "text"},
         {"name": "contacts", "ines":"s", "type":"detail", "model":"contact", "key":"customer", "fields":[
                {"name":"firstname","label":"First name"},
                {"name":"lastname", "label":"Last name"}
            ],
            "destroyMethod":"delete", "destroyEnabled":true,
            "addEnabled": true,
            "addPosition": "top",
            "label":"Contacts"
        }
    ]

}