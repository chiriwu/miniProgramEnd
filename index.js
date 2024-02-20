var express = require('express')
var app = express('https')
var fs = require('fs')
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })
var path = require('path')
const AdmZip = require('adm-zip'); //引入查看zip文件的包

app.get('/',function(req,res){
	console.log('req=',1)
	console.log('res=',2)
})

app.get('/sendcontent',function(req,res){
	// console.log('res.body=',req.body)

	// console.log('res.body=',req.query.content)
	fs.writeFile("./feedback/feedback.txt",'      feedvalue：'+req.query.content,{ 'flag': 'a' },(err)=>{
		if(err)throw err;
	});

	res.end()
})

app.post('/file/0',upload.single('file'),function(req,res){
	// res.send('hello')
	// console.log('res=',req.file)
	// console.log('res.body=',req.body)
	// fs.readFile(req.file.path,'utf-8',function(err, data) { 
	// if (err) { 
	// throw err; 
	//  } 
	//  console.log(data);   
	// });
	res.send(handleA(req.file.path))

})


app.post('/file/1',upload.single('file'),function(req,res){
	// res.send('hello')
	// console.log('res=',req.file)
	// console.log('res.body=',req.body)
	res.send(handleB(req.file.path))

})



app.listen(3000,function(){
	console.log('server is listening')
})


// df=open('vector','rb')
// lst_discriminator_v=pickle.load(df)
// df.close()


function handleA(filePath){
  const zip = new AdmZip(filePath); //filePath为文件路径
  let contentXml = zip.readAsText("word/document.xml");//将document.xml读取为text内容；
  let str = "";

  contentXml.match(/(<w:t>.*?<\/w:t>)|(<w:t\s.[^>]*?>.*?<\/w:t>)/gi).forEach((item)=>{
  // console.log((item.match('>').index))  
  str += item.slice(item.match('>').index+1,-6) 
});

  console.log('str=',str)
  var value = str.split(/[0-9]+\./ig)
  console.log('value=',value)

  var final = []
  value.forEach(item=>{
    if(item!=null){
          var temp = []
    // console.log('item',item)
    // string.split 的正则有点问题，使用 | 有点问题 所以这么用
    var single =item.split(/[A-D]\./ig)
    if(single.length == 1){
      single =item.split(/[A-D]、/ig)
    }
    // console.log('single',single)
    var answer = ''
    single.forEach((t,index)=>{
      // // temp.concat(t)
      // console.log('t=',t) 
      if(index == 0){
        answer = t.match(/[A-D]/ig)
        // console.log('answer=',answer)
        if(answer!=null){
          t = t.split(answer).join('')
        }
        temp = temp.concat(t)
      }
      else{
        temp = temp.concat(t)
        if(index == (single.length-1)){
          temp = temp.concat(answer)
        }
      }
    })
    
    console.log('temp',temp)
    final.push(temp)
    }

  })
  console.log(final)
  return final
}


function handleB(filePath){

const fs = require("fs");
const AdmZip = require('adm-zip'); //引入查看zip文件的包

const zip = new AdmZip(filePath); 
console.log('zip=',zip)
let contentXml = zip.readAsText("word/document.xml");//将document.xml读取为text内容；

let str = "";

contentXml.match(/(<w:t>.*?<\/w:t>)|(<w:t\s.[^>]*?>.*?<\/w:t>)/gi).forEach((item)=>{
  str += item.slice(item.match('>').index+1,-6) 
});

  console.log('str=',str)
  var value = str.split(/[0-9]+、/ig)
  console.log('value=',value)

  var final = []
  value.forEach(item=>{
    var temp = []
    var single =item.split(/[A-D]、/ig)

    single.forEach((t,index)=>{
      temp = t.match(/答案：/ig)?temp.concat(t.split(/答案：/ig)):temp.concat(t)
    })
    final.push(temp)
  })
  console.log(final)
  return final
}