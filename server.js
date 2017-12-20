var redis = require("redis");
var client = redis.createClient({db:0});
var fs = require("fs");

function randomNum(minNum,maxNum){
    switch(arguments.length){
        case 1:
            return parseInt(Math.random()*minNum+1,10);
            break;
        case 2:
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
            break;
        default:
            return 0;
            break;
    }
}


client.on("error", function (err) {
    console.log("Error " + err);
});

function tos(x) {
   if(x == null) {
       return ''
   }
   else {
       return x.toString()
   }
}

// content of index.js
const http = require('http');
const hostname = '0.0.0.0';
const port = 9876;
var url = require('url');
var qs = require('querystring')
var wordinfonum = 0;
const server = http.createServer((req, res) => {

  var shit = url.parse(req.url, true);
  if(req.method == 'GET' && shit.pathname == '/query') {
    res.statusCode = 200;
    var po1,upd1,pj1,n1,pg1,pb1;
    var word = shit.query['name'];
    res.setHeader('Content-Type', 'application/json');
    var cnt = 0
    po1 = client.get("po_"+word, function (err, reply) {
        po1 = tos(reply); 
        client.get("lastupd_"+word, function (err, reply) {
            upd1 = tos(reply); 
            client.get("pj_"+word, function (err, reply) {
                pj1 = tos(reply); 
                client.get("n_"+word, function (err, reply) {
                    n1 = tos(reply); 
                    client.get("pg_"+word, function (err, reply) {
                        pg1 = tos(reply); 
                        client.get("pb_"+word, function (err, reply) {
                            pb1 = tos(reply); 
                            res.end(JSON.stringify({ key: word, po:po1, lastupd:upd1, pj:pj1,n:n1,pg:pg1,pb:pb1}));
                        });
                    });
                });
            });
        });
    });

  }
  
   else if(req.method == 'GET' && shit.pathname == '/test') {
    res.statusCode = 200;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
    
    res.end("Hello");

  }

  else if(req.method == 'GET' && shit.pathname == '/random') {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
     var s = randomNum(0,10);

      res.end(tos(s));

  }

     else if(req.method == 'GET' && shit.pathname == '/lasts') {
    res.statusCode = 200;

      res.setHeader("Content-Type", "application/json; charset=utf-8");

      var data = '';
      var readerStream = fs.createReadStream('lastsentence');
      readerStream.setEncoding('UTF8');

// 处理流事件 --> data, end, and error
      readerStream.on('data', function(chunk) {
          data += chunk;
      });

      readerStream.on('end',function(){
          console.log(data);
          res.end(data);
      });

      readerStream.on('error', function(err){
          console.log(err.stack);
      });



  }

     else if(req.method == 'GET' && shit.pathname == '/burstw') {
      res.statusCode = 200;

      res.setHeader("Content-Type", "application/json; charset=utf-8");

      var data = '';
      var readerStream = fs.createReadStream('burstword.json');
      readerStream.setEncoding('UTF8');

// 处理流事件 --> data, end, and error
      readerStream.on('data', function(chunk) {
          data += chunk;
      });

      readerStream.on('end',function(){
          //console.log(data);
          res.end(data);
      });

      readerStream.on('error', function(err){
          console.log(err.stack);
      });

      //res.end();

  }


  else if(req.method == 'GET' && shit.pathname == '/refresh') {
      res.statusCode = 200;

      res.setHeader("Content-Type", "application/json; charset=utf-8");


      wordinfonum = 0;
      console.log(wordinfonum);

      res.end("refreshed");

  }



  else if(req.method == 'GET' && shit.pathname == '/wordinfo') {
      res.statusCode = 200;

      res.setHeader("Content-Type", "application/json; charset=utf-8");

      var data = '';
      if (wordinfonum == 0){
          console.log(wordinfonum);
          var readerStream = fs.createReadStream('wordinfo1');
          wordinfonum  = 1;
          console.log(JSON.parse(wordinfonum));
      }
      else{
          console.log(wordinfonum);
          var readerStream = fs.createReadStream('wordinfo2');
          wordinfonum  = 0;
          console.log(JSON.parse(wordinfonum));
      }
      readerStream.setEncoding('UTF8');

// 处理流事件 --> data, end, and error
      readerStream.on('data', function(chunk) {
          data += chunk;
      });

      readerStream.on('end',function(){
          //res.end(JSON.parse(data));
          res.end(data);
      });

      readerStream.on('error', function(err){
          console.log(err.stack);
      });

      //res.end();

  }
  
  else {
    res.statusCode = 404;
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end(req.method+shit.pathname+'Illegal\n');
  }
  
  
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});