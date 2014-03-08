sails-crudface
==============

**A sails node module for "systematic" scrud interface generation with MVC architecture.**

If you want sails generate views on the fly for your models, you can use this module and create a configuration file describing the fields and the layout you need for every controller/model.

Often for data entry is not needed complexity but simplicity.
Also, writing the code for the view part of the MVC architecture is a repetitive task, because you may want a standard layout for toolbars, buttons, lists, and so on.

sails-crudface automates the task of creating the user interface for search and entry of data.

The resulting user interface is plain and responsive HTML with [jQuery](http://jquery.com/download/) and [Bootstrap](http://getbootstrap.com/getting-started/#download)

#### REST Approach

The url schema is [REST](http://en.wikipedia.org/wiki/Representational_state_transfer) based, so we have the following possible default implementation for the API:

```
http://<host>:<port>/<controller>[/<operation>][/<id>]
```

Where ```host``` is the host name where sails is running at ```port``` and ```controller``` is the name of the controller/model where the data will be managed and stored.

For example: ```http://localhost:1337/contact```, will show the list of contact stored in the contact table/collection (depending on the DB engine you are using).

```Operation``` can be one of the following:

- ```index```: (implicit) shows al the contacts
- ```new```: presents the view to add a new contact
- ```show```: presents the view to display one specificied contact by ```id```
- ```edit```: presents the view to edit one specified contact by ```id```

Example for index: ```http://localhost:1337/contact/```

Example for new: ```http://localhost:1337/contact/new```

Example for show: ```http://localhost:1337/contact/show/52fa26c7322e9fe034000027```

Example for edit: ```http://localhost:1337/contact/edit/52fa26c7322e9fe034000027```

It works both with SQL and NOSQL database adapters.

#### Supported field types

- text
- date
- button group
- dropdown (with or without relationship)
- checkbox
- textarea
- button

#### Form component layout

You can specify a layout for the components (rows and cols) or let the components flow vertically from the top of the page.
The layout is responsive, mobile first. It's based on the "[Bootstrap grid system](http://getbootstrap.com/css/#grid)", so you can decide for each row, the position and the size of each component.


#### Localization

The components labels are localizeable using the standard i18n in sails, see ```config/locales/_README.md``` to understand how it works, but in short: for each component label, you can specify a localized version.


## [Install](id:install)
First of all, you need an existing sails project ([see here if you want to create a new sailsjs project](http://sailsjs.org/#!getStarted)), **beware: use the --linker option creating the new project**).

```
sails new mytestproject --linker
```

Go to the sails project folder and install the module with npm:

```
npm install sails-crudface
```

The following steps are needed to add the necessary assets to your sails project:

1. Install [jQuery](http://jquery.com/download/) and add the ```'linker/js/jquery.js',``` line in the ```Gruntfile.js``` after the ```'linker/js/app.js',``` line.
2. Goto the ```components``` folder in ```node_modules/sails-crudface```
2. Copy the ```_crud.js``` file in the ```assets/js``` folder of your sails project
3. Add the ```bootstrap``` CSS ([download](http://getbootstrap.com/getting-started/#download)), copy all the sobfolders (js,fonts,style in the ```assets/linker```)
4. Add the ```bootstrap form helpers``` ([download](http://bootstrapformhelpers.com/)) (free version it's OK)
3. Update the ```view/layout.ejs``` file in order to load jQuery.js and _crud.js
3. The module contains two sub-folders:```_crud``` and ```_crudtemplates```, **copy both subfolders** in the ```view``` folder of your sails project.
4. FileUploads controller and model: in order to manage not only text, date and number fields but file attachments too, you need to:
	1. copy the FileuploadsController.js file in the ```api/controllers``` folder
	2. generate the Fileuploads model with:```sails generate model Fileuploads```
	
We are planning to automate the whole installation process in future versions.

## First example: Contact management view

Place you may want to create a view for a contact management model with the fields:

- firstname
- lastname
- phone
- email

#### 1. Generating model and controller

The first requirement is to have a model and a controller, so we will call the model: "contact", use this command:

```
sails generate contact
```

#### 2. Edit the controller

Open the ```ContactController.js``` file you can find in the ```api/controllers``` folder of the sails project, replace the generated javascript with the line:

```
module.exports = require("sails-crudface").init(module,__dirname) ;
```

#### 3. Create the "crud" configuration file

In the ```api/controllers``` folder create a new file named: ```ContactCrudConfig.js```.

This is the place where ```sails-crudface``` will search for the view configuration.

Set the new file content with:

```
{
    "prettyName"  : "Contact",

    "fieldsConfig": [
        {"name": "firstname", "ines": "ines", "type": "text"},
        {"name": "lastname", "ines": "ines", "type": "text"},
        {"name": "email", "ines": "nes", "type": "text"},
        {"name": "phone", "ines": "nes", "type": "text"},
        {"name": "birthdate", "ines":"nes", "type": "date"}
    ]
}
```

#### 4. Create the contact view folder

In order to display the user interface the module needs a view folder with the same name of the model.
So copy the ```_crudtemplate``` folder in the ```contact```.

#### 5. Run your sails project

```sails lift```

#### 6. Visit the contact view

Open the browser at [```http://localhost:1337/contact```](http://localhost:1337/contact)

Enjoy !!

## Crud configuration file specifications

The crud configuration file is readed each time the view is invoked with the browser (no need to restart sails if you want to modify the view content and layout).
For each controller is needed the respective JSON crud configuration file, like in the example above, if for the contact controller we need ```ContactController.js``` for the Crud configuration file we need ```ContactCrudConfig.js```.

The crud configuration file describes the view in each of the four situations: ```index```,```new```,```edit```,```show```.

Also describes the fields layout, the available search fields and the title.

An example follow to show the five first level elements for the configuration:

```
{
    "prettyName"  : "<a human readable title for the view>",

    "textSearchFields": [<array of text fields from the model for the search section>],

    "facets": [<array of facets for the search section>],

    "layout" : [<array of fieldsets, 
    				each fieldset has a name and contains one or more rows, 
    					each row contains one or more fields>],

    "fieldsConfig": [<array of controls, each control has "name", "type" and "ines">]
}
```

#### Who is "ines" ?

(i)ndex | (n)ew | (e)dit | (s)how = "ines".

The "ines" property for a control visible only in the "show" view, is "s", while for a control always visible is "ines".

Because the ```index``` view shows a list of records (aka objects) you may want to show only few fields (aka properties) in the list. 

In the given contact example, the fields the user see in the list are ```firstname``` and ```lastname```.
The ```email```,```phone```,```birthdate``` fields are not visible in the ```index``` view.

### textSearchFields

This property of the Crud configuration file teach the controller (and to the view) wich fields of the model are searchable. For the above contact example, you can set this property as follows:

```
{
    "prettyName"  : "Contact",
    
    "textSearchFields": ["firstname","lastname","email","phone"],

    "fieldsConfig": [
        {"name": "firstname", "ines": "ines", "type": "text"},
        {"name": "lastname", "ines": "ines", "type": "text"},
        {"name": "email", "ines": "nes", "type": "text"},
        {"name": "phone", "ines": "nes", "type": "text"},
        {"name": "birthdate", "ines":"nes", "type": "date"}
    ]
}
```

By default, without ```textSearchFields``` specifications, the controller searches in the fieldsConfig and automatically adds fields with matching conditions to the ```textSearchFields```.
Matching conditions are:

- a field with "name" = "name"
- one or more fields with "inname" property set to ```true```

The following example search only the ```firstname``` field.

```
{
    "prettyName"  : "Contact",
    
    "fieldsConfig": [
        {"name": "firstname", "ines": "ines", "type": "text", "inname":true},
        {"name": "lastname", "ines": "ines", "type": "text"},
        {"name": "email", "ines": "nes", "type": "text"},
        {"name": "phone", "ines": "nes", "type": "text"},
        {"name": "birthdate", "ines":"nes", "type": "date"}
    ]
}
```

### facets

Try this example:

```
{
    "prettyName"  : "Contact",
        
    "facets": [
        {"field": "department", "option": "department", "caption":"Department"}
    ],
    
    "fieldsConfig": [
        {"name": "firstname", "ines": "ines", "type": "text", "inname":true},
        {"name": "lastname", "ines": "ines", "type": "text"},
        {"name": "email", "ines": "nes", "type": "text"},
        {"name": "phone", "ines": "nes", "type": "text"},
        {"name": "birthdate", "ines":"nes", "type": "date"},
        {
        	"name": "department", 
        	"ines":"ines", 
        	"type":"buttongroup", 
        	"options":["Admin","Development","Sales"]
        }
    ]
}
```

Please note two new elements: the ```facet``` property and a new element in the ```fieldsConfig``` property, both referring to the new ```department``` field.

The view will show a new dropdown menu in the search section (and a new buttongroup field-control). 

The user can "select" the department for each contact while creating or editing the contact by clicking the respective button in the new button group named "department".

The user can "filter" the index view using the dropdown and selecting one of the existing options. Options are populated directly from the present values in the ```department``` field for each row. For each option is visible a "count" of corresponding rows.

### layout

One of the more difficult things trying developing a responsive user interface for data entry,search and update is deciding and describing a responsive layout.

Using the "[Bootstrap grid system](http://getbootstrap.com/css/#grid)" we found a good solution (or we think so) to the problem.

In the actual configuration, without layout specifications, all the fields are distributed in a top-down vertical layout, using the 100% page width.

Let's make an example organizing the layout of the contact example.

Put we want a first section for ```firstname``` and ```lastname```, both on the same row, another section named "Details" for the contacts fields (```email```,```phone```), ```birthdate``` and ```department```.

This is the resulting configuration:

```
{
    "prettyName"  : "Contact",
        
    "facets": [
        {"field": "department", "option": "department", "caption":"Department"}
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
        }
    ],
        
    "fieldsConfig": [
        {"name": "firstname", "ines": "ines", "type": "text", "inname":true},
        {"name": "lastname", "ines": "ines", "type": "text"},
        {"name": "email", "ines": "nes", "type": "text"},
        {"name": "phone", "ines": "nes", "type": "text"},
        {"name": "birthdate", "ines":"nes", "type": "date"},
        {
        	"name": "department", 
        	"ines":"ines", 
        	"type":"buttongroup", 
        	"options":["Admin","Development","Sales"]
        }
    ]
}
```

Each element in the ```layout``` array has two properties: 

- ```section```: (can be blank) is the caption for the section, a group of rows
- ```rows```: each row can have one or more fields.

Each field specifies the width that the relative control will use in the grid.
The total width of each row is 12 (as described in the Bootstrap grid system).
So ```firstname:6``` specifies that we want the width equal to 50% of the page.

This means also that:

- the minimum width for each control is 1
- we can have at least 12 controls of width=1 for each row
- the maximum width for each control is 12
- a good distribution of fields yeld always 12 as the sum of the width of each field in a row

Try the above example opening the ```contact``` show view both in a desktop browser and in your mobile browser to see the responsive layout (or simply try to reduce the with of the browser window to a minimum 320px).

### fieldsConfig

The array containing the complete list of controls of the view.

As mentioned above, each list element must have at least 3 properties:

- ```name```: the model 'fieldname' where the entered data will be stored and later readed
- ```type```: the kind of control will be displayed (textfield, calendar, dropdown, ...)
- ```ines```: in witch view the control will be displayed (see above: Who is ines?)

An optional property is ```label```, so you can decide a decent label for each control regardless the name, example:

```
{"name": "firstname", "ines": "ines", "type": "text", "label":"First name"}
```

As mentioned above, the ```label``` property will be localized according to the ```config/locales/``` settings.

#### The "type" property

This property define the kind of control will be displayed. Valid types are:

- ```text```: to display and edit text and numbers
- ```read-only-text```: as above, to display only
- ```link```: to display an url and automatically creating the ```<a>``` element
- ```date```: to display and edit dates with a calendar
- ```textarea```: to display and edit text on more than one line
- ```checkbox```: to display and edit booleans
- ```select```: to display and select values from a list (with or without relationship/association)
- ```read-only-select```: as above, but to display only
- ```buttongroup```: same as ```select```, but for small amount of options
- ```button```: can call a custom action in the underlying controller
- ```detail```: to display records (objects) from a one-to-many relationship/association

#### Examples

##### type: text

```
{"name": "firstname", "ines": "ines", "type": "text", "label":"First name"}
```

##### type: read-only-text

```
{"name": "firstMeetingNotes", "s": "ines", "type": "read-only-text"}
```
Useful to display calculated values, or one-time-editing fields, like in the example below: 

```
...
{"name": "firstMeetingNotes", "ines": "n", "type": "text"},
{"name": "firstMeetingNotes", "ines": "es", "type": "read-only-text"}
...
```
In this example the field is defined two times, the first will be used in the ```new``` view (during record creation) and the second both in the ```edit``` and ```show``` view.


##### type: link

```
{"name": "website", "ines": "ines", "type": "link"}
```
In the ```new``` and ```edit``` views will be displayed as the type:text, otherwise will be displayed as an ```<a>``` element.

##### type: textarea

```
{"name": "notes", "ines": "nes", "type": "textarea"}
```

##### type: checkbox

```
{"name": "vip", "ines": "ines", "type": "checkbox"}
```
The corresponding values for the checked and unchecked state are, by default, ```true``` and ```false```.
If you need to store and retrieve different values you can specify the properties like in the example below:

```
{"name": "vip", "ines": "ines", "type": "checkbox", "checkedValue":"YES","uncheckedValue":"NO"}
```

##### type: select
```
{
	"name": "department", 
    "ines":"ines", 
    "type": "select",
   	"options":["Admin","Development","Sales"]
}
```
This is a particular kind, because it change the behavior depending the kind of view:

- ```new```: presents a drop-down list, with no value selected
- ```edit```: presents a drop-down list, with the selected value according the value stored in the model
- ```show```: presents a read-only-text field with a button ```>>``` on the right if the content of the dropdown list is populated from a relationship/association (see below: ```options```)
- ```index```: presents the value according the value stored in the model and eventually looks-up the value in the model from the other side of the relationship (see below:```options```)

###### options

The ```options``` property defines how the "option" tags are populated in the html ```<select>``` element. 

You can use a simple array of flat strings like below:

```
	"options":["Admin","Development","Sales"]
```
 
or a more complex array with objects, like below:

```
	"options":[
		{"id":"0","text":"poor"},
		{"id":"1","text":"fair"},
		{"id":"2","text":"good"}
	]
```
In this case, the value stored in the model will be "0","1" or "2", but the drop-down list will be populated with "poor","fair","good".

Another way to populate a dropdown list is ```relationship```, like in the example below:

```
{
	"name": "customer", 
	"type": "select",
	"ines": "nes", 
	"relationship": {
		"entity": "customer",
		"inname": "name",
		"filter":{}
	}
}
```
In this case, you must provide a model called "customer" where the controller will find the list of customer to display in the drop-down list.

The list is filtered with the ```filter``` expression, the drop-down list values are populated with the ids of records(objects) and the option value with the ```inname``` field. 

This means that if the "customer" record/object has a field "name", the value of that field will appear in the drop-down list, but the value stored in the contact record is the id of the selected customer in the drop-down list.

###### filter

The filter can be described with an object like:

```
{
  name: 'Steven',
  age: 32,
  phone:'(210)-555-1234'
}

```
Equivalent to SQL expression:

```
SELECT * FROM customer WHERE name = 'Steven' AND age = 32 AND phone = '(210)-555-1234'
```

You can find more info [here](http://sailsjs.org/#!documentation/models) at "find" paragraph.

##### type: read-only-select

This kind of control is used mainly to provide an hypertext link to the releated record in relationship->entity.
It cannot be edited from the user.

##### type: buttongroup

This kind of control presents a list of buttons. The specifications are the same of the type "select", example:

```
{
	"name": "projecttype", 
	"type": "buttongroup",
	"ines": "nes", 
	"relationship": {
		"entity": "projecttype",
		"inname": "name",
		"filter":{}
	}
}
```

##### type: button

This kind of control crates a button with an underlying url, composed by the controller url and the ```action``` property, see example:

```
{"name": "Normalize contact","ines":"s","type":"button","action":"normalize"}
```
The underlying url will be: ```http://localhost:1337/contact/normalize/52fa26c7322e9fe034000027```

In the example, the "normalize" action is implemented in the controller, see example:


```
module.exports = require('sails-crudface').init(module,__dirname) ;

module.exports.normalize = function(req,res,next){
	...
	...
	// your code here
	...
	...
	
};
```


##### type: detail

This kind, in the ```show``` view, permits to show a list of records related to the current record.
In the example below: for each customer we can manage many contacts.
The following code will be placed in the CustomerCrudConfig.js in the ```fieldsConfig``` section:

```
		{"name": "contacts", 
			"ines":"s", 
			"type":"detail", 
			"model":"contact", 
			"key":"customer", "fields":[
				{"name":"firstname","label":"First name"},
				{"name":"lastname", "label":"Last name"}
			],
			"destroyMethod":"delete", "destroyEnabled":true,
			"addEnabled": true,
			"addPosition": "top",
			"label":"Contacts"
		}
```
don't forget to add a reference to "contacts" in the ```layout``` section adding an element like this:

```
{
	section: "", rows:[
		{"contacts":12}
	]
}
```

and requires a relationship in the ContactCrudConfig.js

```
{
	"name": "customer", 
	"type": "select",
	"ines": "nes", 
	"relationship": {
		"entity": "customer",
		"inname": "firstname",
		"filter":{}
	}
}
```

To see the list of contact managed for a customer, you need to navigate to one of the customers.

###### detail configuration

The keys in detail configuration are:

- ```destroyMethod```: can be "delete" or "detach"
- ```destoryEnabled```: false to hide the "Delete/Detach" button for each record
- ```addEnabled```: false to hide the "Add" button
- ```addPosition```: can be "top" or "bottom" or "both"
- ```label```: optional


## Complete example

In the ```example``` folder you can find a complete example you can use for a starting point.
The example presents a Contact model/controller and a Customer model/controller, with a relationship contact->Customer and can be used for a starting point for a complete application.
The example can work in a complete sails setup with all the [Installation](#install) steps completed.

## Addendum

### Sorting

Default sorting is defined automatically on fields with ```"inname":true```.
Otherwise you can set ```fieldSort``` like following:

```
"fieldSort":{
	"lastname":1,
	"firstname":1
},
```

See [waterline docs](https://github.com/balderdashy/waterline-docs/blob/master/query-language.md) for more.

Example, sorting contacts by lastname,firstname and finally by birthdate (descending) :


```
{
    "prettyName"  : "Contact",
        
    "facets": [
        {"field": "department", "option": "department", "caption":"Department"}
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
        }
    ],
       
    "fieldSort":{
		"lastname":1,
		"firstname":1,
		"birthdate":0
	}, 
	
    "fieldsConfig": [
        {"name": "firstname", "ines": "ines", "type": "text", "inname":true},
        {"name": "lastname", "ines": "ines", "type": "text"},
        {"name": "email", "ines": "nes", "type": "text"},
        {"name": "phone", "ines": "nes", "type": "text"},
        {"name": "birthdate", "ines":"nes", "type": "date"},
        {
        	"name": "department", 
        	"ines":"ines", 
        	"type":"buttongroup", 
        	"options":["Admin","Development","Sales"]
        }
    ]
}
```

Please note: the ```fieldSort``` property can be used in the field type ```detail``` too.


### Distinct

Sometimes you need to display only distinct records, based on a comparison field.
You can set ```distinctFieldName``` with the name of the comparison field.
For example, ```id```.


## Runtime javascript API

If you need to run some javascript code when the page is loaded for a certain view, you can add a ```script``` tag in the EJS file.
Example follow for the ```show``` view:

```
<% include ../_crud/show.ejs %>

< script>
	_crud_documentReady = function(){

	// your code here will be called on load (see _crud.js for more)

	}
</script>

```