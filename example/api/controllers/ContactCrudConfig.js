{
    "prettyName"  : "Contact",

    "facets": [
        {"field": "department", "option": "department", "caption":"Department"},
        {"field": "customer", "option": "customer", "caption":"Customer"}
    ],

    
	"layout" : [
        {
          "section": "", "rows": [
            {"firstname":6, "lastname":6}
          ]
        },
        {
            "section":"Details","rows":[
                {"email":8, "phone":4},
                {"birthdate":4,"department":8}
            ]
        },
        {
            "section":"Relazione customer","rows":[
                {"customer":12}
            ]
        },
        {
            "section":"Altri dati","rows":[
                {"Mostra customer":12}
            ]
        }
    ],

    "fieldsConfig": [
        {"name": "firstname", "ines": "ines", "type": "text", "inname":true},
        {"name": "lastname", "ines": "ines", "type": "text", "label":"last name"},
        {"name": "email", "ines": "nes", "type": "text"},
        {"name": "phone", "ines": "nes", "type": "text"},
        {"name": "birthdate", "ines":"nes", "type": "date"},
        {
        	"name": "department", 
        	"ines":"ines", 
        	"type":"buttongroup", 
        	"options":["Admin","Development","Sales"]
        },
        {"name": "Mostra customer","ines":"s", "type":"button", "action":"mostracustomer"},
        {
			"name": "customer", 
			"type": "select",
			"ines": "ines", 
			"relationship": {
				"entity": "customer",
				"inname": "firstname",
				"filter":{}
			}
		}
    ]

}