var clc = require('cli-color'),
    querystring = require('querystring'),
    fs = require('fs');

var show = function(request,response){

  console.log(clc.yellow('Request for "show" was called'));
  
  fs.readFile("/tmp/test.jpg","binary",function(error,file){
    if (error) {
      response.writeHead(500,{"Content-Type":"text/plain"});
      response.write(error + '\n');
      response.end();
    };
      response.writeHead(200,{"Content-Type": 'image/jpg'});
      response.write(file,"binary");
      response.end();
  })

}

exports['/show'] = show;