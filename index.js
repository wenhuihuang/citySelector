//import { transliterate as tr, slugify } from 'transliteration';
var tran = require('transliteration');
var fs = require('fs');
var a = tran.transliterate("你好吗");
var b = tran.slugify("你好吗");
console.log(a)
console.log(b)

var data = fs.readFileSync('test.json','utf-8');
fs.writeFileSync('test.json','{"city":"广州"}',function(){
    console.log('写入')
})
 var dataObj = JSON.parse(data);
console.log(dataObj.city) 