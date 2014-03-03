/**
 * FileuploadsController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    
  


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to FileuploadsController)
   */
  _config: {},

  send: function(req,res,next){
    var recordid ;
    var recordIdDefined = (req.param('recordid') != "") && (req.param('recordid') != "undefined") && (req.param('recordid') != undefined) ;
    if (recordIdDefined) {
      recordid = req.param('recordid') 
  	}
    var fs = require("fs") ;
    var classname = req.param('classname') ;
  	var private = req.param('public') ? false : true ;
  	fs.readFile(req.files.file.path, function (err, data) {
  		var newPath = __dirname + "/../../.tmp/uploads/" + req.files.file.name;
  		Fileuploads.create({
  			path: newPath,
  			user: req.session.User.id,
  			originaldata: req.files.file,
  			classname: classname,
  			recordid: recordid,
  			private: private
  		}, function(err,newFileUpload){
  			if (err) return next(err) ;
			fs.writeFile(newPath, data, function (err) {
				if (sails.controllers[classname].onFileUpload){
          sails.controllers[classname].onFileUpload(res,req,next,newFileUpload,function(err){
            if (!err) res.json({id:newFileUpload.id, filename: req.files.file.name}) ;
            if (err) return next(err) ;
          }) ;
        } else {
          res.json({id:newFileUpload.id, filename: req.files.file.name}) ;
        }
			});  			
  		})
	 });
  },

  receive: function(req,res,next){
    var fs = require("fs") ;
    Fileuploads.findOne(req.param('id'),function(err,foundFile){
      if (foundFile.private && foundFile.user != req.session.User.id){
        return res.json({errcode:'Forbidden'})
      }
      var relativepath = __dirname + "/../../.tmp/uploads/" + foundFile.originaldata.originalFilename ;
      var path = require("path") ;
      var absolutepath = path.resolve(relativepath) ;
      res.attachment(absolutepath) ;
      res.download(absolutepath,foundFile.originaldata.originalFilename) ;
    })
  },

  remove: function(req,res,next){

    function removeFile(fileToRemove){
      var relativepath = __dirname + "/../../.tmp/uploads/" + fileToRemove.originaldata.originalFilename ;
      fs.unlink(relativepath, function(err){
        if (!err || err.errno == 34){
          Fileuploads.destroy(fileToRemove.id,function(removeerr){
            if (removeerr) return res.json(removeerr) ;
            res.json({ok:true}) ;
          })
        } else {
          return res.json(err) ;
        }
      }) ;
    }

    var fs = require("fs") ;
    Fileuploads.findOne(req.param('id'),function(err,foundFile){
      if (!foundFile) return ;
      if (foundFile.private && foundFile.user != req.session.User.id){
        return res.json({errcode:'Forbidden'})
      }
      var classname = req.param('classname') ;
      if (sails.controllers[classname].onFileRemove){
        sails.controllers[classname].onFileRemove(res,req,next,foundFile,function(err){
          if (!err) {
            removeFile(foundFile) ;
          } else {
            return res.json(err) ;
          } 
        }) ;
      } else {
        removeFile(foundFile) ;
      }

      
    })
  },

  index: function(req,res,next){
  	res.view();
  },

  attachedFilesList: function(classname, recordid,attachedFilesListCallBack){
    Fileuploads
      .find({classname:classname, recordid: recordid}, function(err,attachmentsFound){
        if (err) attachedFilesListCallBack(err) ;
        if (!err) attachedFilesListCallBack(err,attachmentsFound) ;      
      })
  }
};
