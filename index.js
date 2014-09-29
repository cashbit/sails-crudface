/**
 * sails-crudface
 *
 * @module      :: sails-crudface
 * @description :: Automatically creates user interface for data entry
 * @docs        :: https://www.npmjs.org/package/sails-crudface
 */

(function(){


  if(!String.prototype.trim) {
    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g,'');
    };
  }

  Boolean.prototype.crudRender = function(params){
    if (params){
      if (this.toString() === "true"){
        return params.name || params.label ;
      } else {
        return "" ;
      }
    } else if (this.toString() === "true"){
      return "YES" ;
    } else {
      return "NO" ;
    }
  };

  String.prototype.crudRender = function(){
    return this ;
  };

  String.prototype.toDateFromLocale = function(){
    var dateElements = this.split('/') ;
    var outputDateElements = [] ;
    var locale = {} ;
    locale.dateFormat = "d/m/y" ;
    var dateFormatPositions = locale.dateFormat.split('/') ;
    
    var dateFormatElements = {
      y: 0,
      m: 0,
      d: 0
    };

    for (var element in dateFormatElements){
      var dateFormatElementPosition = module.exports.findStringInArray(element,dateFormatPositions) ;
      outputDateElements.push(dateElements[dateFormatElementPosition]) ;
    }
    return new Date(outputDateElements) ;
  };

  Number.prototype.textAlign = "text-right" ;

  Number.prototype.localeThousandSeparator = function(){
    return "." ;
  }
  Number.prototype.localeDecimalSeparator = function(){
    return "," ;
  }

  Number.prototype.localeCurrencySymbol = function(){
    return "&euro; " ;
  }

  Number.prototype.localeCurrecyDecimals = function(){
    return 2 ;
  }

  Number.prototype.crudRender = function(config){
    if (!config) return this.formatNumber();
    if (config.format) config = config.format ;
    if (config == 'percent'){
      var p = this * 100 ;
      return p.formatNumber(2,this.localeDecimalSeparator(),this.localeThousandSeparator()) + " %" ;
    } 
    if (config == 'integer') return this.formatNumber(0,this.localeDecimalSeparator(),this.localeThousandSeparator()) ;
    if (config == 'year') return this.formatNumber(0,this.localeDecimalSeparator(),"") ;
    if (config == 'float') return this.formatNumber(2,this.localeDecimalSeparator(),this.localeThousandSeparator()) ;
    if (config == 'currencyNoDec') return this.formatNumber(
        0,
        this.localeDecimalSeparator(),
        this.localeThousandSeparator(),
        this.localeCurrencySymbol()
    ) ;
    if (config == 'currency') return this.formatNumber(
        this.localeCurrecyDecimals(),
        this.localeDecimalSeparator(),
        this.localeThousandSeparator(),
        this.localeCurrencySymbol()
    ) ;
    return this.formatNumber(config.c,config.d,config.t,config.m) ;
  };

  Number.prototype.formatMoney = function(c, d, t){
    var n = this,
      c = isNaN(c = Math.abs(c)) ? 2 : c,
      d = d == undefined ? "." : d,
      t = t == undefined ? "," : t,
      s = n < 0 ? "-" : "",
      i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
      j = (j = i.length) > 3 ? j % 3 : 0;
     return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
   };

  Number.prototype.formatNumber = function(c, d, t, m){
    var n = this,
      c = isNaN(c = Math.abs(c)) ? 2 : c,
      d = d == undefined ? "," : d,
      t = t == undefined ? "." : t,
      s = n < 0 ? "-" : "",
      i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
      j = (j = i.length) > 3 ? j % 3 : 0;
      // todo: use M to position before or after the currecy symbol...
      m = m == undefined ? "" : " " + m ;
     return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "") + m;
  };

  Date.prototype.crudRender = function(){
    return this.formatDate() ;
  };

  Date.prototype.formatDate = function(){
    var outputDateElements = [] ;
    // todo: get the current locale
    var locale = {} ;
    locale.dateFormat = 'd/m/y' ;
    var dateFormatPositions = locale.dateFormat.split('/') ;
    for (var i=0;i<dateFormatPositions.length;i++){
      if (dateFormatPositions[i] == 'd'){
        outputDateElements.push(this.getDate()) ;
      }
      if (dateFormatPositions[i] == 'm'){
        outputDateElements.push(this.getMonth()+1) ;
      }
      if (dateFormatPositions[i] == 'y'){
        outputDateElements.push(this.getFullYear()) ;
      }
    }
    var output = '' ;
    for (var i=0;i<outputDateElements.length;i++){
      var element = outputDateElements[i] ;
      if (element.toString().length < 2){
        element = '0'+element ;
      }
      if (output.length > 0) output += '/' ;
      output += element ;
    }
    return output ;
  };
})();


/*
  Use init to initialize the controller with standard methods:
  - index   (lists all object in model)
  - new     (shows the view to create a new object in model)
  - edit    (shows the view to edit an existing object in model)
  - show    (shows an identified object in model)

  Example: if you have a model called "Project", these methods will be called with urls:
  - index:  /project
  - new:    /project/new
  - edit:   /project/edit/<objectid>
  - show:   /project/show/<objectid>

*/

module.exports.getCurrentLocale = function(){
  if (!sails.config.locale){
        sails.config.locale = {
          it: {
            dateFormat : 'd/m/y'
          },
          en: {
            dateFormat : 'm/d/y'
          }
        };
  }
  // todo: dinamically load from the user-agent locale
  return sails.config.locale.it ;
} ;

module.exports.addConfigurationToViewConfig = function(req,res,config){
  var locale = module.exports.getCurrentLocale() ;
  config.locale = locale ;
} ;

module.exports.init = function(controller,fromPath){
  this.fromPath = fromPath ;

  var managedController = {
    index : function(req,res,next){
        module.exports.searchView(req,res,next,controller,{},function(viewConfig){
          res.view(viewConfig);
        });
    },

    'new' : function(req,res,next){
      module.exports.createView(req,res,next,controller,function(viewConfig){
        res.view(viewConfig);
      });
    },

    edit : function(req, res, next) {
      module.exports.updateView(req,res,next,controller,function(viewConfig){
        res.view(viewConfig);
      });
    },

    show : function(req, res, next) {
      module.exports.readView(req,res,next,controller,function(viewConfig){
        res.view(viewConfig);
      });
    },

    createAction : function(req, res, next) {
      module.exports.createAction(req,res,next,controller);
    },

    updateAction : function(req, res, next) {
      module.exports.updateAction(req,res,next,controller) ;
    },

    destroyAction : function(req, res, next) {
      module.exports.destroyAction(req,res,next,controller) ;
    },

    subscribe : function(req, res) {
      module.exports.subscribe(req,res,controller) ;
    },

    compare : function(req,res,next){
      module.exports.searchView(req,res,next,controller,{},function(viewConfig){
        res.view(viewConfig);
      });
    },

    config : function(req,res,next){
      // sends config to client
      module.exports.sendConfig(req,res,next,controller,function(err,viewConfig){
        if (!err){
          res.header('Content-type','text/json');
          res.send(viewConfig) ;
        } else {
          res.send(err) ;
        }
        
      })
    },

    csvexport: function(req,res,next){
      module.exports.searchView(req,res,next,controller,{},function(viewConfig){
        var fieldlist = [] ;
        for (var i=0;i<viewConfig.fields.length;i++){
          var field = viewConfig.fields[i] ;
          //if (field.ines.indexOf('i')>-1) 
          fieldlist.push(field.name) ;
        }
        var fieldSeparator = 's' ;
        if (req.param('CSV') == 'c' || req.param('CSV') == 's'|| req.param('CSV') == 't'){
          fieldSeparator = req.param('CSV') ;
        }
        res.header('Content-type','text/csv');
        res.header('Content-disposition','attachment;filename=' + controller.exports.globalId  + '.csv');
        res.send(module.exports.exportCSV(viewConfig.records,fieldSeparator,fieldlist)) ;
      });
    },

    findForSelect: function(req,res,next){
      module.exports.searchView(req,res,next,controller,{},function(viewConfig){
        var inNameFields = [] ;
        for (var f=0;f<viewConfig.fields.lenght;f++){
          var field = viewConfig.fields[f] ;
          if (field.inname) inNameFields.push(field.name) ;
        }
        if (inNameFields.length === 0) inNameFields.push('name') ;
        var output = [] ;
        for (var i=0;i<viewConfig.records.length;i++){
          var inNameValues = [] ;
          var record = viewConfig.records[i] ;
          for (var ff=0;ff<inNameFields.length;ff++){
            inNameValues.push(record[inNameFields[ff]]) ;
          }
          var inName = inNameValues.join(' ') ;
          var outRec = {
            id: record.id,
            value: inName
          } ;
          output.push(outRec) ;
        }
        res.send(output) ;
      }) ;
    }
  } ;

  return managedController ;
} ;


module.exports.addUrlToBreadCrumbs = function(req,text,url){
  if (!req.session.breadCrumbs) req.session.breadCrumbs = [] ;
  for (var i=0;i<req.session.breadCrumbs.length;i++){
    var breadCrumb = req.session.breadCrumbs[i] ;
    if (breadCrumb.url === url){
      req.session.breadCrumbs.splice(i,1) ;
      break ;
    }
  }
  req.session.breadCrumbs.push({text:text,url:url}) ;
  if (req.session.breadCrumbs.length > 5) req.session.breadCrumbs.splice(0,1) ;
} ;

module.exports.removeUrlFromBreadCrumbs = function(req,url){
  if (!req.session.breadCrumbs) req.session.breadCrumbs = [] ;
  for (var i=0;i<req.session.breadCrumbs.length;i++){
    var breadCrumb = req.session.breadCrumbs[i] ;
    if (breadCrumb.url === url){
      req.session.breadCrumbs.splice(i,1) ;
      break ;
    }
  }
} ;


/*
  This method is called during runtime to obtain the configuration of the view for each crud operation
  If the controller name is "ProjectController.js" it loads the configuration from the companion file: "ProjectCrudConfig.js"
  The configuration file contains a JSON object describing:
  - the list of fields for each crud operation (mandatory)
  - the layout of fields in the crud operations
*/

module.exports.sendConfig = function(req,res,next,controller,cb){
  var filepath = this.fromPath +"/" + controller.exports.globalId + "CrudConfig.js" ;
  var fs = require('fs') ;
  if (fs.existsSync(filepath)){
    var fromFileString = fs.readFileSync(filepath) ;
    var dataString = fromFileString.toString().replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:([\s;])+\/\/(?:.*)$)/gm, '$1');
    cb(null,dataString) ;
  } else {
    cb(new Error("Config not available!")) ;
  }
},

module.exports.loadConfig = function(controller){
  var filepath = this.fromPath +"/" + controller.exports.globalId + "CrudConfig.js" ;
  var fs = require('fs') ;
  if (fs.existsSync(filepath)){
    var fromFileString = fs.readFileSync(filepath) ;
    var dataString = fromFileString.toString().replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:([\s;])+\/\/(?:.*)$)/gm, '$1');
    if (dataString){
      var config = JSON.parse(dataString) ;
      if (config) _.extend(controller.exports,config);
      if (controller.exports.accessManager){
        var controllerAPIDelegate = sails.services[controller.exports.accessManager.toLowerCase()] ;
        if (!controllerAPIDelegate){
          throw new Error("BAD sails-crudface accessManager name: " + controller.exports.accessManager + ", service not found!") ;
        }
      } else {
        controllerAPIDelegate = sails.services['sails-crudface-accessmanager'] ;
      }
      if (controllerAPIDelegate){
        if (controllerAPIDelegate.getFilter) controller.exports.getFilter = controllerAPIDelegate.getFilter ;
        if (controllerAPIDelegate.beforeIndex) controller.exports.beforeIndex = controllerAPIDelegate.beforeIndex ;
        if (controllerAPIDelegate.beforeShow) controller.exports.beforeShow = controllerAPIDelegate.beforeShow ;
        if (controllerAPIDelegate.beforeCreate) controller.exports.beforeCreate = controllerAPIDelegate.beforeCreate ;
        if (controllerAPIDelegate.beforeUpdate) controller.exports.beforeUpdate = controllerAPIDelegate.beforeUpdate ;
        if (controllerAPIDelegate.beforeDelete) controller.exports.beforeDelete = controllerAPIDelegate.beforeDelete ;
      }
    }
  }
};


module.exports.findFieldInConfigByName = function(fieldName,controller){
  for (var f=0;f<controller.exports.fieldsConfig.length;f++){
    var field = controller.exports.fieldsConfig[f] ;
    if (field.name === fieldName){
      return field ;
    }
  }
  return ;
};

module.exports.autoLayout = function(controller,viewType){
  /*

  layout: [
    {
      section: "Document", rows: [
        {PO:2,DocumentType:3,Description:6,Code:1},
        {Language:2,LastReview:2,PageFormat:4,General:4}
      ]
    }

  */
  if (!controller.exports.layout) {
    controller.exports.layout = [
        {
          section: "", rows: []
        }
      ] ;

      for (var i=0;i<controller.exports.fieldsConfig.length;i++){
        var field = controller.exports.fieldsConfig[i] ;
        var ines = field.ines ;
        if (ines.indexOf(viewType) > -1){
          var control = {} ;
          control[field.name] = 12;
          controller.exports.layout[0].rows.push(control) ;
        }
      }
  }
  
  var outputLayout = [] ;
  for (var i=0;i<controller.exports.layout.length;i++){
    var section = controller.exports.layout[i].section ;
    var rows = controller.exports.layout[i].rows ;
    var newRows = [] ;
    for (var r=0;r<rows.length;r++){
      var row = rows[r] ;
      var newRow = {} ;
      var fieldCount = 0 ;
      for (var fieldName in row){
        var afield = module.exports.findFieldInConfigByName(fieldName,controller) ;
        if (afield){
          if (afield.ines.indexOf(viewType) > -1){
              newRow[afield.name] = row[fieldName] ;
              fieldCount++ ;
          }
        }
      }
      /*
      for (var f=0;f<controller.exports.fieldsConfig.length;f++){
        var field = controller.exports.fieldsConfig[f] ;
        if (row[field.name]){
          if (field.ines.indexOf(viewType) > -1){
            newRow[field.name] = row[field.name] ;
            fieldCount++ ;
          }
        }
      }
      */
      if (fieldCount){
        newRows.push(newRow) ;
      }
    }
    if (newRows.length > 0){
      outputLayout.push({section:section, rows: newRows, config:controller.exports.layout[i]}) ;
    }
  }

  return outputLayout ;
};

module.exports.createView = function(req,res,next,controller,callback){

  this.loadConfig(controller) ;

  var layout = module.exports.autoLayout(controller,"n") ;
  var returnUrl = req.param('returnUrl') ;
  var name = controller.exports.customIdentity || controller.exports.identity ;
  var fields = controller.exports.fieldsConfig ;

  var newObj = {} ;
  for (var i=0;i<fields.length;i++){
    var fieldName = fields[i].name ;
    if (fields[i].ines.indexOf('n') > -1) newObj[fieldName] = req.param(fieldName) ;
  }

  var viewConfig = {
        fields: fields,
        fieldlayout: layout,
        controller: controller.exports.identity,
        prettyName: controller.exports.prettyName,
        record : newObj,
        returnUrl: returnUrl
  } ;

  module.exports.addConfigurationToViewConfig(req,res,viewConfig);
  
  var relationships = [] ;
  for (var i=0;i<viewConfig.fields.length;i++){
    var field = viewConfig.fields[i] ;
    if (field.type == 'checkbox'){
       field.checked = false ;
    }
    if (field.relationship){
      relationships.push(field) ;
    }
  }

  async.each(relationships,module.exports.compileOptionsForRelationships,function(err){
    callback(viewConfig);
  });
},

module.exports.AddRelatedRecords = function(fields,req,next){
  
  function addRelatedRecord(field,cb){
    newObj = {} ;
    newObj[field.relationship.inname] = req.param(field.name) ;
    sails.models[field.relationship.entity].create(newObj, function(err,newCreatedObj){
      addedObjectIds[field.relationship.requestField] = newCreatedObj.id ;
      cb(err);
    });
  }
  
  selectAddFields = [] ;
  for (var i=0;i<fields.length;i++){
    field = fields[i] ;
    if (field.type == 'select-add'){
      selectAddFields.push(field);
    }
  }

  addedObjectIds = {} ;


  async.each(
    selectAddFields,
    addRelatedRecord,
    function(err){
      next(err,addedObjectIds) ;
    }
  ) ;

}

module.exports.createAction = function(req,res,next,controller){
  this.loadConfig(controller) ;
  var name = controller.exports.customIdentity || controller.exports.identity ;
  var fields = controller.exports.fieldsConfig ;
  this.AddRelatedRecords(fields,req,function(err,addedObjectIds){
      
      if (err) {
        console.log(err);
        req.session.flash = {
          err: err
        };
        if (returnUrl != "undefined") return res.redirect(returnUrl) ;
        return res.redirect('/'+ name + '/new/');
      }

      var returnUrl = req.param('returnUrl') ;
      var newObj = {} ;
      for (var i=0;i<fields.length;i++){
        var field = fields[i] ;
        var fieldName = field.name ;
        if (field.type == 'checkbox'){
          var checkedValue = field.checkedValue === undefined ? true : field.checkedValue ;
          var uncheckedValue = field.uncheckedValue === undefined ? false : field.uncheckedValue ;
          if (req.param(fieldName) === undefined){
            newObj[fieldName] = uncheckedValue ;
          } else {
            newObj[fieldName] = checkedValue ;
          }
        } else {
          var value = req.param(fieldName) ;
          if (value !== undefined) {
            if (field.type == 'date'){
              if (req.param(fieldName).toDateFromLocale){
                var date = req.param(fieldName).toDateFromLocale() ;
                if (date.toString() !== "Invalid Date") newObj[fieldName] = date ;
              }
            } else {
              newObj[fieldName] = req.param(fieldName) ;
            }
          }
        }
      }
      if (req.session.User){
        if (!newObj.creator) newObj.creator = req.session.User.id ;
      }

      for (var fieldNameInAddedObjectIds in addedObjectIds){
        newObj[fieldNameInAddedObjectIds] = addedObjectIds[fieldNameInAddedObjectIds] ;
      }
      async.series(
        [
          function (cb){
            if (controller.exports.beforeCreate){
              controller.exports.beforeCreate(req,res,newObj,function(err){
                cb(err) ;
              }) ;
            } else {
              cb() ;
            }
          }
        ],
        function(err){
          if (err) return next(err) ;
          sails.models[name].create(newObj, function (err, newCreatedObj) {
              if (err) {
                console.log(err);
                req.session.flash = {
                  err: err
                };
                if (returnUrl != 'undefined') return res.redirect(returnUrl) ;
                return res.redirect('/'+ controller.exports.identity + '/new/');
              } else {
                sails.models[name].publishCreate(newCreatedObj.toJSON());
                if (returnUrl != 'undefined') return res.redirect(returnUrl) ;
                res.redirect('/'+ controller.exports.identity + '/show/' + newCreatedObj.id);
              }
          });
        }


      ) ;
  }) ;
},

module.exports.addCustomFacet = function(viewConfig,caption,field,values,selectedvalue){
  viewConfig.facets.push({
    config : {field:field, caption: caption} ,
    values : values,
    selectedvalue : selectedvalue
  }) ;
},

module.exports.searchView = function(req, res, next, controller, filter, callback) {

    this.loadConfig(controller) ;

    function populateCompare(viewConfig){
      viewConfig.compareConfig = controller.exports.compareConfig ? controller.exports.compareConfig : {} ;
    }

    function populateFacets(viewConfig){
      var facets = [] ;
      viewConfig.facets = facets ;
      
      if (!controller.exports.facets) return ;

      for (var i=0;i<controller.exports.facets.length;i++){
        var facet = controller.exports.facets[i] ;
        facets.push({field:facet.field, values:{},config: facet, selectedvalue: req.param(facet.field)}) ;
      }

      for (var i=0;i<viewConfig.records.length;i++){
        var record = viewConfig.records[i] ;
        for (var f=0;f<facets.length;f++){
          var facet = facets[f] ;
          var value = record[facet.field] ;
          if (record[facet.field+"_id"] !== undefined){
              value = record[facet.field+"_id"] ;
          }
          var option = record[facet.config.option] ;
          if (value === undefined) value = "(null)" ;
          if (value === "") value = "(blank)" ;
          if (option === "") option = "(blank)" ;
          if (value === null) value = "(null)";
          if (option === null) option = "(null)" ;
          if (!facet.values[value]){
            facet.values[value] = {value: value, option: option, count:1 };
          } else {
            facet.values[value].count++ ;
          }
        }
      }
    }

    function makeFilter(filter){
      if (controller.exports.facets){
        for (var i=0;i<controller.exports.facets.length;i++){
          var field = controller.exports.facets[i].field ;
          var fielddefined = (req.param(field) !== '') && (req.param(field) != 'undefined') && (req.param(field) !== undefined) ;
          if (fielddefined){
            if (!filter) filter = {} ;
            var attribute = false ;
            if (sails.models[controller.exports.customIdentity || controller.exports.identity]._attributes){
                attribute = sails.models[controller.exports.customIdentity || controller.exports.identity]._attributes[field] ;
            } 
            var isString = false ;
            var isBoolean = false ;
            if (attribute){
              if (attribute.type){
                isString = (attribute.type === 'string') ;
                isBoolean = (attribute.type === 'boolean') ;
              } else {
                isString = (attribute === 'string') ;
                isBoolean = (attribute === 'boolean') ;
              }
            } else {
              if (!isBoolean) isString = isNaN(parseFloat(req.param(field))) ;
            }
            if (isString){
              //filter.where[field] = req.param(field) ;
              filter[field] = req.param(field) ;
            } else if (isBoolean){
              var boolValue = req.param(field) === 'true' ;
              //filter.where[field] = boolValue ;
              filter[field] = boolValue ;
            } else {
              //filter.where[field] = parseFloat(req.param(field)) ;
              filter[field] = parseFloat(req.param(field)) ;
            }
            
            //if (filter.where[field] == '(blank)') filter.where[field] = '' ;
            //if (filter.where[field] == '(null)') filter.where[field] = null ;
            if (filter[field] == '(blank)') filter[field] = '' ;
            if (filter[field] == '(null)') filter[field] = null ;

            //sails.log.debug(filter) ;
          }
        }
      }
      return filter ;
    }

    function removeDuplicateIds(viewConfig){
      if (!controller.exports.distinctFieldName) return ;
      var presentIds = {} ;
      var util = require('util') ;
      var distinctFieldName = controller.exports.distinctFieldName ;
      for (var rr = viewConfig.records.length-1;rr>=0;rr--){
        var record = viewConfig.records[rr] ;
        var rId = record[distinctFieldName] ;
        if (presentIds[rId]){
          viewConfig.records.splice(rr,1) ;
        } else {
          presentIds[rId] = true ;
        }
      }
    }

    function cutRecordToViewLimit(viewConfig){
      if (req.param('__viewlimit') === 'all'){
        viewConfig.recordcount = viewConfig.records.length ;
        viewConfig.pagecount = 1 ;
        viewConfig.viewpage = 1 ;
        viewConfig.viewlimit = viewlimit ;
        return ;
      }


      var viewpage = 1 ;
      var viewlimit = 100 ;

      if (req.param('__viewlimit') > 0){
        viewlimit = req.param('__viewlimit')*1 ;
      }
      if (req.param('__viewpage') > 0){
        viewpage = req.param('__viewpage')*1 ;
      }

      viewConfig.recordcount = viewConfig.records.length ;
      viewConfig.pagecount = Math.ceil(viewConfig.records.length/viewlimit) ;
      viewConfig.viewpage = viewpage ;
      viewConfig.viewlimit = viewlimit ;

      if (viewlimit == 'all') return ;


      if (viewConfig.records.length > viewlimit){
        var offset = (viewlimit*(viewpage -1)) ;
        var limitRecords = [] ;
        for (var i=offset;i<(viewlimit + offset);i++){
          limitRecords.push(viewConfig.records[i] ) ;
        }
        viewConfig.records = limitRecords ;
      }
    }

    function calcRankForText(text,record){
      var rank = 0 ;
      for (var i=0;i<controller.exports.textSearchFields.length;i++){
        var field = controller.exports.textSearchFields[i] ;
        var value = record[field] ;
        if (value){
          if (value.toString().toLowerCase().indexOf(text.toLowerCase()) > -1) rank++ ;
        }
      }
      return rank/controller.exports.textSearchFields.length ;
    }

    function freeTextSearch(viewConfig){
      
      viewConfig.freetext = "" ;

      if (!controller.exports.textSearchFields) {
        controller.exports.textSearchFields = [] ;
        for (var i=0;i<controller.exports.fieldsConfig.length;i++){
          var field = controller.exports.fieldsConfig[i] ;
          if (field.name == "name") {
            controller.exports.textSearchFields.push("name") ;
          } else if (field.inname) {
            controller.exports.textSearchFields.push(field.name) ;
          }
        }
      }

      var fielddefined = (req.param('__freetext') !== "") && (req.param('__freetext') != "undefined") && (req.param('__freetext') !== undefined) ;
      if (!fielddefined) return ;

      var text = req.param('__freetext') ;
      var outputrecords = [] ;
      for (var i=0;i<viewConfig.records.length;i++){
        var record = viewConfig.records[i] ;
        var rank = calcRankForText(text,record) ;
        if (rank > 0){
          outputrecords.push(record) ;
        }
      }
      viewConfig.freetext = text ;
      viewConfig.records = outputrecords ;
    }

    function calculateFooter(record,viewConfig){
      
      if (!viewConfig.footerFieldsConfig) return ;

      for (var f=0;f<viewConfig.footerFieldsConfig.length;f++){
        var footerFieldConfig = viewConfig.footerFieldsConfig[f] ;
        footerFieldConfig.count = footerFieldConfig.count ? footerFieldConfig.count : 0 ;
        var value = record[footerFieldConfig.name] ;
        if (!value) value = 0;
        if (footerFieldConfig.value === undefined) footerFieldConfig.value = 0 ;
        if (footerFieldConfig.func === 'sum') footerFieldConfig.value += record[footerFieldConfig.name] ;
        
        if (footerFieldConfig.func === 'count'){
          footerFieldConfig.value++ ;
        }
        if (footerFieldConfig.func === 'average'){
          footerFieldConfig.value = (footerFieldConfig.value * footerFieldConfig.count + value) / (footerFieldConfig.count+1) ;
        }
        footerFieldConfig.count++ ;
      }
    }

    function run(filter){
      var viewConfig ;
      var relationships ;

      function populateRelationshipsOnRecord(record,populateCallBack){
        
        function populateThisRelationshipOnRecord(field,populateThisCallBack){
          var relationship = field.relationship ;
          var relatedRecordId = record[field.name] ;
          var relatedEntity = relationship.entity ;
          if (!relatedRecordId) return populateThisCallBack();
          sails.models[relatedEntity].findOne(relatedRecordId,function(err,foundRecord){
            if (err){
              populateThisCallBack(err) ;
            } else {
              record[field.name+"_id"] = record[field.name] ;
              if (foundRecord){
                if (typeof(relationship.inname) == "object"){
                  var values = [] ;
                  for (var i=0;i<relationship.inname.length;i++){
                    values.push(foundRecord[relationship.inname[i]]) ;
                  }
                  record[field.name] = values.join(" ") ;
                } else {
                  record[field.name] = relationship.inname ? foundRecord[relationship.inname] : foundRecord.inName() ;
                }
              } else {
                record[field.name] = null ;
              }
              populateThisCallBack() ;
            }
          });
        }
        
        calculateFooter(record,viewConfig) ;

        async.each(relationships,populateThisRelationshipOnRecord,function(err){
          populateCallBack() ;
        });
      }

      filter = makeFilter(filter);

      if (!controller.exports.fieldSort){
        controller.exports.fieldSort = {} ;
        for (var i=0;i<controller.exports.fieldsConfig.length;i++){
          var field = controller.exports.fieldsConfig[i] ;
          if (field.inname){
            controller.exports.fieldSort[field.name] = 'asc' ;
          }
        }
      }

      sails.models[name].find(filter).sort(controller.exports.fieldSort).exec(function(err, foundRecords) {
        if (err) return next(err);
        viewConfig = {
          fields: controller.exports.fieldsConfig,
          controller: controller.exports.identity,
          prettyName: controller.exports.prettyName,
          records : foundRecords,
          footerFieldsConfig : controller.exports.footerFieldsConfig
        } ;

        freeTextSearch(viewConfig) ;

        module.exports.addConfigurationToViewConfig(req,res,viewConfig);

        relationships = [] ;
        for (var i=0;i<viewConfig.fields.length;i++){
          var field = viewConfig.fields[i] ;
          if (field.relationship){
            relationships.push(field) ;
          }
        }



        async.each(
          foundRecords,
          populateRelationshipsOnRecord,
          function(err){
            populateCompare(viewConfig);
            populateFacets(viewConfig);
            removeDuplicateIds(viewConfig);
            cutRecordToViewLimit(viewConfig) ;
            if (controller.exports.beforeIndex){
              async.each(
                viewConfig.records,
                function(record,cb){
                  record._crudConfig = {
                    canShow : true,
                    canEdit : true,
                    canDelete : true
                  }
                  controller.exports.beforeIndex(req,res,record,cb) ;
                },
                function(err){
                  if (err) {
                    console.log("Error, beforeIndex") ;
                    console.log(err) ;
                  }
                  callback(viewConfig);
                }
              );
            } else {
              callback(viewConfig) ;
            }    
          }
        );

      });
    }

    var name = controller.exports.customIdentity || controller.exports.identity ;
    //module.exports.addUrlToBreadCrumbs(req, "List of " + name, "/" + name) ;

    if (controller.exports.getFilter){
      controller.exports.getFilter(req,res,function(err,filter){
        if (err) return next(err) ;
        run(filter);
      }) ;
    } else {
      run() ;
    }
},

module.exports.readView = function(req,res,next,controller,callback){

  this.loadConfig(controller) ;

  var layout = module.exports.autoLayout(controller,"s") ;

  var name = controller.exports.customIdentity || controller.exports.identity ;

  sails.models[name].findOne(req.param('id'),function(err,foundRecord){
    if (err) next(err) ;
    var inname = name ;
    if (!foundRecord) return res.send(404);
    if (controller.exports.beforeShow){
      controller.exports.beforeShow(req,res,foundRecord,function(err){
        if (err) {
          sails.log.warn(err) ;
          return res.send(404);
        } else {
          run() ;
        }
      }) ;
    } else {
      run() ;
    }

    function run(){
      if (foundRecord.name) inname = foundRecord.name ;
      module.exports.addUrlToBreadCrumbs(req, inname, "/" + name + "/show/" + req.param('id')) ;
      var viewConfig = {
          fields: controller.exports.fieldsConfig,
          fieldlayout: layout,
          controller: controller.exports.identity,
          prettyName: controller.exports.prettyName,
          showAttachments : controller.exports.showAttachments | false,
          attachmemtIsPublic : controller.exports.attachmemtIsPublic | true,
          record : foundRecord
      } ;


      module.exports.addConfigurationToViewConfig(req,res,viewConfig);

      var relationships = [] ;
      var buttongroupsrelationships = [] ;
      var details = [] ;
      for (var i=0;i<viewConfig.fields.length;i++){
        var field = viewConfig.fields[i] ;
        if (field.type == 'checkbox'){
          var checkedValue = field.checkedValue === undefined ? true : field.checkedValue ;
          var uncheckedValue = field.uncheckedValue === undefined ? false : field.uncheckedValue ;
          field.checked = (foundRecord[field.name] == checkedValue) ;
        }
        if ((field.type != 'buttongroup') && field.relationship){
          relationships.push({
            entity:field.relationship.entity,
            attribute : field.name
          }) ;
        }
        if ((field.type == 'buttongroup') && field.relationship){
          buttongroupsrelationships.push(field) ;
        }
        if (field.type == "detail"){
          details.push(field) ;
        }
      }

      function compileRelationshipOnRecord(relationship, record, callback){
        var recordId = record[relationship.attribute] ;
        sails.models[relationship.entity].findOne({id:recordId},function(err,foundRecord){
          if (err) return callback(err) ;
          record[relationship.attribute] = foundRecord ;
          callback() ;
        });
      }

      function compileRelationshipOnRecordWithInName(relationship, record, callback){
        var recordId = record[relationship.attribute] ;
        sails.models[relationship.entity].findOne({id:recordId},function(err,foundRecord){
          if (err) return callback(err) ;
          record[relationship.attribute] = foundRecord.name ? foundRecord.name : foundRecord.inName() ;
          callback() ;
        });
      }

      function compileDetails(detailConfig,callback){
        /*
        {"name": "activeCountries", "ines":"nes", "type":"detail", "model":"country","key":"agent", "fields":[
          {"name":"name","label":"Country"},
          {"name":"areamanager", "label":"Area manager"}
        ]}
        */

        

        var filter = detailConfig.filter || {} ;
        filter[detailConfig.key] = foundRecord.id ;
        var relationships = [] ;
        var attributes = sails.models[detailConfig.model]._attributes ;
        for (var attrname in attributes){
          var attribute = attributes[attrname] ;
          if (attribute.model){
            relationships.push({
              attribute : attrname,
              entity: attribute.model
            }) ;
          }
        }

        if (!detailConfig.fieldSort){
          detailConfig.fieldSort = {} ;
          for (var i=0;i<detailConfig.fields.length;i++){
            var field = detailConfig.fields[i] ;
            if (field.inname){
              controller.exports.fieldSort[field.name] = 'asc' ;
            }
          }
        }

        sails.models[detailConfig.model].find(filter).sort(detailConfig.fieldSort).exec(function(err,foundRecords){
          detailConfig.records = foundRecords ;
          if (err) return callback(err) ;
          if (foundRecords.length === 0) return callback() ;
          async.each(foundRecords,function(detailfoundRecord,detailFoundCallback){
            async.each(
              relationships,
              function(relationship,callback){
                compileRelationshipOnRecord(relationship,detailfoundRecord,callback);
              },
              function(err){
                detailFoundCallback(err);
              }
            );
          },function(err){
            callback(err) ;
          });
        });
      }


      async.parallel({
          relationships: function(rcallback){
            async.each(
              relationships,
              function(relationship,callback){
                compileRelationshipOnRecord(relationship,foundRecord,callback);
              },
              function(err){
                rcallback(err);
              }
            );
          },
          buttonGroups: function(bgcallback){
            async.each(buttongroupsrelationships,module.exports.compileOptionsForRelationships,function(err){
              bgcallback(err);
            });
          },
          details: function(fcallback){
            async.each(details,compileDetails,function(err){
              fcallback(err);
            });
          },
          attachments: function(acallback){
            module.exports.attachedFilesList(name, req.param('id'), viewConfig, function(err){
              acallback(err);
            });
          }
      },
      function(err, results) {
          callback(viewConfig);
      });      
    }
    

  });
},

module.exports.updateView = function(req,res,next,controller,callback){

  this.loadConfig(controller) ;

  var layout = module.exports.autoLayout(controller,"e") ;
  var returnUrl = req.param('returnUrl') ;
  var name = controller.exports.customIdentity || controller.exports.identity ;
  sails.models[name].findOne(req.param('id'),function(err,foundRecord){
    if (err) next(err) ;
    if (!foundRecord) return res.send(404);
    if (controller.exports.beforeUpdate){
      controller.exports.beforeUpdate(req,res,foundRecord,{},function(err){
        if (err) {
          sails.log.warn(err) ;
          return res.send(501);
        } else {
          run() ;
        }
      }) ;
    } else {
      run() ;
    }


    function run(){
      var viewConfig = {
            fields: controller.exports.fieldsConfig,
            fieldlayout: layout,
            controller: controller.exports.identity,
            prettyName: controller.exports.prettyName,
            record : foundRecord,
            returnUrl: returnUrl
      } ;
      module.exports.addConfigurationToViewConfig(req,res,viewConfig);
      var relationships = [] ;
      for (var i=0;i<viewConfig.fields.length;i++){
        var field = viewConfig.fields[i] ;
        if (field.type == 'checkbox'){
          var checkedValue = field.checkedValue === undefined ? true : field.checkedValue ;
          var uncheckedValue = field.uncheckedValue === undefined ? false : field.uncheckedValue ;
          field.checked = (foundRecord[field.name] == checkedValue) ;
        }
        if (field.relationship){
          relationships.push(field) ;
        }
      }

      async.each(relationships,module.exports.compileOptionsForRelationships,function(err){
        callback(viewConfig);
      });
    }
  });
},

module.exports.updateAction = function(req,res,next,controller){

  this.loadConfig(controller) ;
  var returnUrl = req.param('returnUrl') ;
  var name = controller.exports.customIdentity || controller.exports.identity ;
  var fields = controller.exports.fieldsConfig ;
  var updateObj = {id:req.param('id')} ;
  for (var i=0;i<fields.length;i++){
    var field = fields[i] ;
    var fieldName = field.name ;
    if (field.ines.indexOf('e') > -1){

      if (field.type == 'checkbox'){
        var checkedValue = field.checkedValue === undefined ? true : field.checkedValue ;
        var uncheckedValue = field.uncheckedValue === undefined ? false : field.uncheckedValue ;
        if (req.param(fieldName) === undefined){
          updateObj[fieldName] = uncheckedValue ;
        } else {
          updateObj[fieldName] = checkedValue ;
        }
      } else {
        var value = req.param(fieldName) ;
        if (value !== undefined) {
          if (field.type == 'date'){
            if (req.param(fieldName).toDateFromLocale){
              var date = req.param(fieldName).toDateFromLocale() ;
              if (date.toString() !== "Invalid Date") updateObj[fieldName] = date ;
            }
          } else {
            updateObj[fieldName] = req.param(fieldName) ;
          }
        }
      }
    }
  }
  if (req.session.User){
    if (!updateObj.updator) updateObj.updator = req.session.User.id ;
  }

  if (controller.exports.beforeUpdate){
    sails.models[name].findOne({id:req.param('id')},function(err,foundRecord){
      if (err) {
        sails.log.warn(err) ;
        return res.send(404);
      }
      controller.exports.beforeUpdate(req,res,foundRecord,updateObj,function(err){
        if (err) {
          sails.log.warn(err) ;
          return res.send(501);
        } else {
          run() ;
        }
      }) ;
    }) ;
  } else {
    run() ;
  }

  function run(){
    sails.models[name].update({id:req.param('id')},updateObj, function (err, updatedObjs) {
      if (err) {
        console.log(err);
        req.session.flash = {
          err: err
        };
        if (returnUrl != "undefined") return res.redirect(returnUrl) ;
        res.redirect('/'+ controller.exports.identity + '/show/' + req.param('id'));
      } else {
        sails.models[name].publishUpdate(req.param('id'),updatedObjs[0].toJSON());
        if (returnUrl != "undefined") return res.redirect(returnUrl) ;
        res.redirect('/'+ controller.exports.identity + '/show/' + req.param('id'));
      }
    });
  }
},

module.exports.destroyAction = function(req,res,next,controller){

console.log("ieccchime");
  this.loadConfig(controller) ;

  var returnUrl = req.param('returnUrl') ;
  var method = req.param('method') ;
  var name ;

  if (method == "detach"){
    name = req.param('model') ;
    var key = req.param('key') ;
    var updateObj = {} ;
    updateObj[key] = null ;
    sails.models[name].update(req.param('id'),updateObj,function(err,updatedObjs){
      if (err) return next(err);
      res.redirect(req.param('returnUrl')) ;
    });
  } else {
    name = controller.exports.customIdentity || controller.exports.identity ;
    module.exports.removeUrlFromBreadCrumbs(req, "/" + name + "/show/" + req.param('id')) ;
    sails.models[name].findOne(req.param('id'), function (err, objectToDelete) {
        if (err) return next(err);
        if (!objectToDelete) return next(controller.exports.prettyname + ' doesn\'t exist.');
        if (controller.exports.beforeDelete){
          controller.exports.beforeDelete(req,res,objectToDelete,function(err){
            if (err) {
              sails.log.warn(err) ;
              return res.send(501);
            } else {
              run() ;
            }
          }) ;
        } else {
          run() ;
        }

        function run(){
          var inname ;
          sails.models[name].destroy(req.param('id'), function (err) {
              if (err) return next(err);
              if (typeof(objectToDelete.inName) == 'function'){
                inname = objectToDelete.inName() ;
              } else {
                var fields = controller.exports.fieldsConfig ;
                var innamevalues = [] ;
                for (var i=0;i<fields.length;i++){
                  var field = fields[i] ;
                  if (field.inname) innamevalues.push(objectToDelete[field.name]) ;
                }
                inname = innamevalues.join(' ') ;
              }
              sails.models[name].publishUpdate(req.param('id'), {
                name: inname,
                action: ' has been destroyed.'
              });
              sails.models[name].publishDestroy(req.param('id'));
              if (returnUrl !== undefined) return res.redirect(returnUrl) ;
              res.redirect('/' + controller.exports.identity);
          });
        }
    });
  }
},

module.exports.subscribe = function(req, res, controller) {
  var name = controller.exports.customIdentity || controller.exports.identity ;
  sails.models[name].find(function (err, objects) {
    if (err) return next(err);
    sails.models[name].subscribe(req.socket);
    sails.models[name].subscribe(req.socket, objects);
    res.send(200);
  });
},


module.exports.compileOptionsForRelationships = function(field,relationshipcallback){

  function compare(a,b) {
    if (a.text < b.text)
       return -1;
    if (a.text > b.text)
      return 1;
    return 0;
  }

  var relationship = field.relationship ;
  sails.models[relationship.entity]
    .find(field.relationship.filter)
    .exec(function(err,foundRecords){
      if (err){
        relationshipcallback(err) ;
        return;
      }
      var options = [] ;
      for (var i=0;i<foundRecords.length;i++){
        if (typeof(relationship.inname) == "object"){
          var values = [] ;
          for (var n=0;n<relationship.inname.length;n++){
            values.push(foundRecords[i][relationship.inname[n]]) ;
          }
          var option = {
            id: foundRecords[i].id,
            text : values.join(" ")
          }; 
        } else {
          var option = {
            id: foundRecords[i].id,
            text : relationship.inname ? foundRecords[i][relationship.inname] : foundRecords[i].inName()
          };         
        }

        options.push(option);
      }

      options.sort(compare) ;

      field.options = options ;
      relationshipcallback() ;
    });
},


module.exports.compileFileDisposition = function(controller){

},

module.exports.createFieldListFromAllRowsInArray = function(data){
  var fieldListDictionary = {} ;
  for (var i=0;i<data.length;i++){
    var row = data[i].toJSON() ;
    for (var field in row){
      if (!fieldListDictionary[field]) fieldListDictionary[field] = true ;
    }
  }
  var fieldList = [] ;
  for (var field in fieldListDictionary){
    fieldList.push(field) ;
  }
  return fieldList ;
}

module.exports.exportCSV = function(data,fieldSeparator,fieldList){
  /*
    data: json
    fieldSeparator : "c" = "," , "s" = ";", "t" = "\t" ;
  */
  var fieldSeparatorDefined = (fieldSeparator !== "") && (fieldSeparator != "undefined") && (fieldSeparator !== undefined) ;
  fieldSeparator = fieldSeparatorDefined ? fieldSeparator : "s" ;
  if (fieldSeparator == "c") fieldSeparator = "," ;
  if (fieldSeparator == "s") fieldSeparator = ";" ;
  if (fieldSeparator == "t") fieldSeparator = "\t" ;
  var rowSeparator = "\n" ;
  if (data.length === 0) return ;
  var output = [] ;
  var fields = [] ;

  if (!fieldList){
    fieldList = module.exports.createFieldListFromAllRowsInArray(data) ; 
  }

  for (var i=0;i<data.length;i++){
    var row = data[i].toJSON() ;
    var outputrow = [] ;
    if (i===0){
      if (fieldList){
        for (var ff=0;ff<fieldList.length;ff++){
          var field = fieldList[ff] ;
          outputrow.push(field) ;
          fields.push(field) ;
        }
      } else {
        for (var field in row){
          //if (field.indexOf(fieldSeparator) > -1) field = '"' + field + '"' ;
          outputrow.push(field) ;
          fields.push(field) ;
        }        
      }
      output.push(outputrow.join(fieldSeparator)) ;
      outputrow = [] ;
    }

    for (var f=0;f<fields.length;f++){
      var fieldName = fields[f];
      var fieldValue = row[fieldName] ;

      if (typeof(fieldValue) == "boolean") {
        fieldValue = (fieldValue ? '"X"' : '"-"');
      }
      if (typeof(fieldValue) == 'string'){
        if (fieldValue.indexOf(fieldSeparator) > -1) fieldValue = '"' + fieldValue + '"' ;
        if (fieldValue.indexOf(rowSeparator) > -1) fieldValue = fieldValue.replace(rowSeparator,"\\"+rowSeparator) ;
      }
      if (typeof(fieldValue) == 'number') {
        if (Math.round(fieldValue) != fieldValue){
          fieldValue = fieldValue.formatNumber() ;
        }
        
      }
      outputrow.push(fieldValue) ;
    }
    output.push(outputrow.join(fieldSeparator)) ;
  }
  return output.join(rowSeparator) ;
},

module.exports.populateThisRelationshipOnRecord = function(config,populateThisCallBack){
  var field = config.field ;
  var record = config.record ;
  var relatedRecordId = record[field.name] ;
  var relatedEntity = field.entity ;
  sails.models[relatedEntity].findOne(relatedRecordId,function(err,foundRecord){
    if (err){
      populateThisCallBack(err) ;
    } else {
      if (foundRecord){
        record[field.name] = foundRecord ;
      } else {
        record[field.name] = null ;
      }
      populateThisCallBack() ;
    }
  });
},

module.exports.populateRelationshipsOnRecord = function(record,entityName,populateCallBack){
        
  var relationships = [] ;
  for (var attrname in sails.models[entityName]._attributes){
    var attr = sails.models[entityName]._attributes[attrname] ;
    if (attr.model){
      relationships.push({
        field: {
          name : attrname,
          entity: attr.model
        },
        record: record
      }) ;
    }
  }
  
  async.each(relationships,module.exports.populateThisRelationshipOnRecord,function(err){
    populateCallBack() ;
  });
},

module.exports.populateRelationshipsOnRecordArray = function(recordArray,entityName,populateOnArrayCallBack){
  
  function populate(record,callback){
    module.exports.populateRelationshipsOnRecord(record,entityName,function(err){
      callback(err);
    });
  }

  async.each(recordArray,populate,function(err){
    populateOnArrayCallBack();
  });
},

module.exports.attachedFilesList = function(classname, recordid, viewConfig, attachedFilesListCallBack){
  Fileuploads
    .find({classname:classname, recordid: recordid}, function(err,attachmentsFound){
      viewConfig.attachedFiles = attachmentsFound ;
      attachedFilesListCallBack(err) ;
    });
},

module.exports.findStringInArray = function(str, strArray){
    for (var j=0; j<strArray.length; j++) {
        if (strArray[j].match(str)) return j;
    }
    return -1;
}