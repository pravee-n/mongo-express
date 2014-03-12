var config = require('../config');
var bson = require('../bson');


exports.viewDocument = function(req, res, next) {  

  var ctx = {
    title: 'Viewing Document: ' + req.document._id,
    editorTheme: config.options.editorTheme,
    docString: bson.toString(req.document)
  };

  res.render('document', ctx);
};

exports.addNewDocument = function(req, res, next) {
  var ObjectID = require('mongodb').ObjectID;

  var docString,
    newId = new ObjectID(),
    collectionEmpty = false;

  req.collection.find().toArray(function(err, items) {
    // console.log('here')
    // console.log(items.length)
    docString = bson.toString(items[0]);
    if ( items.length > 0 ) {
      docString = docString.replace( /(ObjectID)\("(\w+)"\)/, '$1\("'+ newId +'"\)' );
    } else {
      collectionEmpty = true;
    }
    var ctx = {
      newId: newId,
      docString: docString,
      newDoc: true,
      collectionEmpty: collectionEmpty
    };

    res.render('document', ctx);
  });
}

exports.getReferenceNames = function(req, res, next) {  

  var json = {};
  json.name = req.document.username;
  body = JSON.stringify(json);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Length', body.length);
  res.end(body);

  /*for (var k in req.document){
    if (req.document.hasOwnProperty(k)) {
         console.log("Key is " + k + ", value is" + req.document[k]);
         console.log("Key is " + typeof(k) + ", value is" + typeof(req.document[k]));
    }
  }*/

};



exports.addDocument = function(req, res, next) {

  var doc = req.body.document;

  if (doc == undefined || doc.length == 0) {
    req.session.error = "You forgot to enter a document!";
    return res.redirect('back');
  }

  var docBSON;

  try {
    docBSON = bson.toBSON(doc);
  } catch (err) {
    req.session.error = "That document is not valid!";
    console.error(err);
    return res.redirect('back');
  }

  req.collection.insert(docBSON, {safe: true}, function(err, result) {
    if (err) {
      req.session.error = "Something went wrong: " + err;
      console.error(err);
      return res.redirect('back');
    }

    req.session.success = "Document added!";
    res.redirect(config.site.baseUrl+'db/' + req.dbName + '/' + req.collectionName);
  });
};


var querystring = require('querystring');
var http = require('http');
var fs = require('fs');

function PostCode(codestring) {
  console.log(codestring)
  // Build the post string from an object
  var post_data = querystring.stringify({
      'compilation_level' : 'ADVANCED_OPTIMIZATIONS',
      'output_format': 'json',
      'output_info': 'compiled_code',
        'warning_level' : 'QUIET',
        'js_code' : codestring
  });

  // An object of options to indicate where to post to
  var post_options = {
      host: 'localhost',
      port: '8001',
      path: '/dataEntry/nodeUpdate/',
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': post_data.length
      }
  };

  // Set up the request
  var post_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          // console.log('Response: ' + chunk);
      });
  });

  // post the data
  post_req.write(post_data);
  post_req.end();

}

exports.updateDocument = function(req, res, next) {
  var doc = req.body.document;

  if (doc == undefined || doc.length == 0) {
    req.session.error = "You forgot to enter a document!";
    return res.redirect('back');
  }

  var docBSON;
  try {
    docBSON = bson.toBSON(doc);
  } catch (err) {
    req.session.error = "That document is not valid!";
    console.error(err);
    return res.redirect('back');
  }

  docBSON._id = req.document._id;

  req.collection.update(req.document, docBSON, {safe: true}, function(err, result) {
    if (err) {
      //document was not saved
      req.session.error = "Something went wrong: " + err;
      console.error(err);
      return res.redirect('back');
    }

    req.session.success = "Document updated!";
    if (req.collection.collectionName == 'unmapped_product') {
      PostCode('a=' + docBSON._id)
    }
    res.redirect(config.site.baseUrl+'db/' + req.dbName + '/' + req.collectionName);
  });
};


exports.deleteDocument = function(req, res, next) {
  req.collection.remove(req.document, {safe: true}, function(err, result) {
    if (err) {
      req.session.error = "Something went wrong! " + err;
      console.error(err);
      return res.redirect('back');
    }

    req.session.success = "Document deleted!";
    res.redirect(config.site.baseUrl+'db/' + req.dbName + '/' + req.collectionName);
  });
};
