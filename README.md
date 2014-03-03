sails-crudface
==============

A sails node module for "systematic" scrud interface generation

If you want sails generate views on the fly for your models, you can use this module and create a configuration file describing the fields for each of the standard ```new```,```read```,```update```,```delete``` operations.


## Install
First of all, you need an existing sails project ([see here if you want to create a new sailsjs project](http://sailsjs.org/#!getStarted)).
Go to the sails project and install the module with npm in the sailsjs project folder with:

```
npm install sails-crudface
```

The module contains two sub-folders:

- _crud
- _crudtemplates

**copy both subfolders** in the ```view``` folder of your sails project.

####_crud
Contains the basics ejs files for generating the views.

####_crudtemplate
Contains the examples you can copy for each new view subfolder you want to create.


## Example

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
        {"name": "phone", "ines": "nes", "type": "text"}
    ]
}
```