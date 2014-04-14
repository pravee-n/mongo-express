//Add routes from other files
var db = require('./database');
var coll = require('./collection');
var doc = require('./document');

exports.viewDatabase = db.viewDatabase;

exports.viewCollection = coll.viewCollection;
exports.addCollection = coll.addCollection;
exports.deleteCollection = coll.deleteCollection;
exports.renameCollection = coll.renameCollection;
exports.getCollectionTemplate = coll.getCollectionTemplate;
exports.fetchAllDocuments = coll.fetchAllDocuments;
exports.fetchFirstDocument = coll.fetchFirstDocument;
exports.fetchDocument = coll.fetchDocument;
exports.getProductIds = coll.getProductIds;

exports.viewDocument = doc.viewDocument;
exports.getReferenceNames = doc.getReferenceNames;
exports.updateDocument = doc.updateDocument;
exports.deleteDocument = doc.deleteDocument;
exports.addDocument = doc.addDocument;
exports.addNewDocument = doc.addNewDocument;

exports.saveImage = function(req, res){

  var fs = require('fs'),
    config = require('.././config');

  var path = require('path'),
    destinationPath =  config.imageRoot,
    errorFlag = false,
    iconTypes = req.body.type,
    ctr = 0;

    iconTypes = iconTypes.split(',');

  // if ( imageType == 'icon' ) {
  //   destinationPath += config.iconImageDir;
  // } else if ( imageType == 'product' ) {
  //   destinationPath += config.productImageDir
  // }

  for ( key in req.files ){
    var innerDirectory = '';

    // console.log(req.files[key].name)

    console.log(iconTypes[ctr])
    if ( iconTypes[ctr] == 'filterIcon' ) {
      innerDirectory += config.filterIconDir;
    } else if ( iconTypes[ctr] == 'subcatImage' ) {
      innerDirectory += config.subcatImageDir;
    }

    console.log(destinationPath + innerDirectory)

    fs.rename(
      req.files[key].path,
      destinationPath + innerDirectory + req.files[key].name,
      function( error ) {
        if ( error ) {
          errorFlag = true;
        }
      } );

    ctr++;
  }

  if ( errorFlag ) {
    res.send( {
      error: 'Error while saving image. Please try again later or try to save without uploading images.'
    } )
  } else {
    res.send( '1' )
  }

}


//Homepage route
exports.index = function(req, res) {
  var ctx = {
    title: 'Mongo Express',
    info: false
  };

  if (typeof req.adminDb == "undefined") {
    return res.render('index');
  }

  req.adminDb.serverStatus(function(err, info) {
    if (err) {
      //TODO: handle error
      console.error(err);
    }

    ctx.info = info;

    res.render('index', ctx);
  });
};
