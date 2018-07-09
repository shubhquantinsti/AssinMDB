const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

  mongoose.connect('mongodb://localhost/work');

  mongoose.connection.once('open',function(){
    console.log('Connection has been made...');
  }).on('error',function(error){
      console.log('Connection error',error);
  });
