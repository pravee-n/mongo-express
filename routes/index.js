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
