'use strict'
var url = require('url');
var path = require('path');
var fs = require('fs');
var mime = require('mime-types');
var clc = require('cli-color');
var swig = require('swig');

var customHandlers = require('./customHandlers');
var customRoutes = require('./customRoutes');

var fourOhFour = function(req,res){

  res.writeHead(404,{"Content-Type":"text/plain"});
  res.end('404 Not Found');

};

var errorCall = function(req,res,err){

  res.writeHead(500,{"Content-Type":"text/plain"});
  console.error(clc.red.bold(err));
  res.end('\n' + err + '\n');

};

var readFile = function(req,res,filename,contentType){

  fs.readFile('.'+filename,{encoding:'utf8'},function(err,data){
    if (err) {
      fourOhFour(req,res);
    }else{
      console.log(contentType)
      res.writeHead(200,{"Content-Type":contentType});
      res.end(data);
    }
  })

};
var readDir = function(req,res,dirname,contentType){
  
  fs.readdir('.'+dirname,function(err,files){
    if (err) {
      fourOhFour(req,res);
    }else{
      var template = swig.compileFile('app/folder.html');
      var output = template({folder:dirname,files:files});
      res.end(output);
    }

  })

};
var handleAll = function(req,res,pathname,responsePath){
  var extension = "";
  if (typeof responsePath == 'undefined') {
    responsePath = pathname;
  }else{
    responsePath = customRoutes.defaultFolder + responsePath
  }

  extension = path.extname(responsePath)
  
  // mime.lookup returns false if no mime is found
  if (mime.lookup(extension)) {
    var contentType = mime.lookup(extension)
    readFile(req,res,responsePath,contentType);
  }else{
    readDir(req,res,responsePath);
  }

};


module.exports = function(pathname,req,res){

  // removes the '/' character in the end of the path
  // to remove headaches in the future
  
  if (pathname.substr(-1) == "/" && pathname.length > 1) {
    pathname = pathname.substring(0,pathname.length - 1)
  };
    
    console.log("Routing the request for " + pathname)

  if (typeof customHandlers[pathname] === 'function'){

    customHandlers[pathname](req,res);

  }else if( typeof customRoutes.customPath[pathname] !== 'undefined' ){
    
    var responsePath = customRoutes.customPath[pathname];
    
    handleAll(req,res,pathname,responsePath);

  }else{

    handleAll(req,res,pathname);
  
  }
};