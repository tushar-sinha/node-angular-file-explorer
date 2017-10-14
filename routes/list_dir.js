var express = require('express');
var router = express.Router();
var path = require('path');
var dir = process.cwd();
var fs = require('fs');
var _ = require('underscore');

router.get('/', function(req, res) {
 var currentDir =  dir;
 var query = req.query.path || '';
 if (query) currentDir = path.join(dir, query);
 console.log("browsing ", currentDir);
 fs.exists(currentDir, function (exists) {
      if(exists){
          fs.readdir(currentDir, function (err, files) {
              if (err) {
                 throw err;
               }
               var data = [];
               data.push({root: dir, isRoot:true});
               files
               .forEach(function (file) {
                 try {
                         var isDirectory = fs.statSync(path.join(currentDir,file)).isDirectory();
                         if (isDirectory) {
                           data.push({ type : 'folder', IsDirectory: true, Path : path.join(query, file), Name : file, size : 0, isRoot:false});
                         } else {
                           var ext = path.extname(file);
                           data.push({ type : 'file', Name : file, Ext : ext, IsDirectory: false, Path : path.join(currentDir, file), size : fs.statSync(path.join(currentDir,file)).size, isRoot:false});
                         }
                 } catch(e) {
                   console.log(e);
                 }
               });
               data = _.sortBy(data, function(f) { return f.type });
               res.json(data);
           });
      }
      else{
        res.end('File does not exists');
      }
    });
});
module.exports = router;
