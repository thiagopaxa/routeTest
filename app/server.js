var http = require('http');
var url = require('url');
var clc = require('cli-color');

exports.start = function(route){
  
  var onRequest = function(req,res){
    
    var urlFull = url.parse(req.url,true);
    var pathname = urlFull.pathname;
    console.log("Request for \'" + pathname + "\' received");
    
    route(pathname,req,res);
    
  }
  
  http.createServer(onRequest).listen(8888);
  console.log(clc.cyan.bold("Server started at port 8888"));

}