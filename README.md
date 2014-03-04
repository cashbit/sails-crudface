sails-crudface
==============

**A sails node module for "systematic" scrud interface generation with MWC architecture.**

If you want sails generate views on the fly for your models, you can use this module and create a configuration file describing the fields and the layout you need for every controller/model.

The user interface is plain and responsive HTML with [jQuery](http://jquery.com/download/) and [Bootstrap](http://getbootstrap.com/getting-started/#download)

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


## Install
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

#### What is "ines" ?

(i)ndex | (n)ew | (e)dit | (s)how = "ines".

The "ines" property for a control visible only in the "show" view, is "s", while for a control always visible is "ines".

Because the ```index``` view shows a list of records (aka objects) you may want to show only few fields (aka properties) in the list. 

In the given contact example, the fields the user see in the list are ```firstname``` and ```lastname```.
The ```email```,```phone```,```birthdate``` fields are not visible in the ```index``` view.

#### textSearchFields

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

#### facets

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
