
var http = require('http');
var fs = require('fs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/work');

mongoose.connection.once('open',function(){
  console.log('Connection has been made...');
}).on('error',function(error){
    console.log('Connection error',error);
});

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
var filename;
// var workSchema = new Schema({
//   id: String,
//   file: String
// });

var workSchema = new Schema({file:String});

var collectionW = mongoose.model('coll',workSchema);

function get(req,res){

      collectionW.find({}, function(err, data) {
        console.log(data);
        res.end(data.toString());
      })

}
var qs = require('querystring');
function add(request, response){

    if (request.method == 'POST') {
        var body = '';
        request.on('data', function (data) {
            body += data;

            //var data1 = new collectionW(JSON.parse(body));
            var data1 = new collectionW({file:"abcd"});
            data1.save(function(err, data){
              //console.log(data1._id.toString());
              var folder = '';
              folder += data1._id.toString();

              fs.mkdir('./files/'+folder,function(){
                filename = makeid();
                fs.writeFile('./files/'+folder+'/'+filename,body,function(){
                  collectionW.findOneAndUpdate({_id:data1._id},{file:'./files/'+folder+'/'+filename}).then(function(result){
                    console.log('updated');
                    console.log('Data saved...');
                    console.log(data1);
                    response.end(JSON.stringify(data));
                  });
                });
              });
            });
            //collectionW.findOneAndUpdate({_id: data1.id},{file:'efgh'});

        });

    }
}

function getid(req,res){

  var str = '';
  var comp = '';
  var k=0;
  str += req.url;
  for (var i = 0; i < str.length; i++) {
    if(str[i]==='?' && k===0){
      k=1;
    }
    else if(k===1){
      comp += str[i];
    }
  }
  return comp;

}


function getfile(path){
  var str = '';
  str += path;
  var rev = '';
  for (var i = str.length-1; i >= 0; i--) {
    if(str[i]==='/')
      break;
    else
      rev += str[i];
  }

  var file = '';
  for (var i = rev.length-1; i >=0 ; i--) {
    file += rev[i];
  }
  return file;
}


function del(req,res){
    // collectionW.findOneAndRemove({age:19},function(){
  //     console.log('removed');
    // });

    var delr = getid(req,res);
    //console.log(delr);
    collectionW.findOne({_id:delr}).then(function(result){
      //console.log(typeof(result.file));
      var filename = getfile(result.file);
      fs.unlink('./files/'+delr+'/'+filename, function(){
        console.log('file deleted');    // first will remove the file under the dir
        fs.rmdir('./files/'+delr,function(){
          console.log('folder deleted');
          collectionW.findOneAndRemove({_id:delr},function(){
            console.log('removed from database');
            res.end();
          });
        });                                     // after that remove the dir
      });

    });

}

var server = http.createServer(function(req,res){
  res.writeHead(200,{'Content-Type': 'text/plain'});

  if(req.url === '/get'){
    get(req,res);
  }else if (req.url === '/add'){
      add(req, res);
  }else{
    del(req,res);
  }

});

server.listen(3000,'127.0.0.1');
