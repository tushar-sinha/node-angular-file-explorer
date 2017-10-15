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
  fs.exists(currentDir, function (exists) {
    if(exists){
      fs.readdir(currentDir, function (err, files) {
        if (err) {
          throw err;
        }
        var data = [];
        data.push({root: dir, isRoot:true});
        var counter = 0;
        files.forEach(function (file) {
          try {
            //var isDirectory = fs.statSync(path.join(currentDir,file)).isDirectory();
            fs.stat(path.join(currentDir,file), function(err, stats){
              if(err){ throw err; }
              else{
                if(stats.isDirectory()) {
                  data.push({ type : 'folder', IsDirectory: true, Path : path.join(query, file), Name : file, size : 0, isRoot:false});
                } else {
                  var ext = path.extname(file);
                  data.push({ type : 'file', Name : file, Ext : ext, IsDirectory: false, Path : path.join(currentDir, file), size : stats.size, isRoot:false});
                }
                counter++;
                if(counter == files.length){
                data = _.sortBy(data, function(f) { return f.type });
                res.json(data);
                }
              }
            });
          } catch(e) {
            console.log(e);
          }
        });
      });
    }
    else{
      res.end('File does not exists');
    }
  });
});
module.exports = router;
