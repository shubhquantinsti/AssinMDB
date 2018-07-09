// function makeid() {
//   var text = "";
//   var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//
//   for (var i = 0; i < 5; i++)
//     text += possible.charAt(Math.floor(Math.random() * possible.length));
//
//   return text;
// }
//
// console.log(makeid());


var str = '';
str += './files/5b3da52743d8a15b1b43051b/Sej6X'
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

console.log(rev);
console.log(file);
