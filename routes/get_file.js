var express = require('express');
var router = express.Router();
var dir = process.cwd();
var path = require('path');
var fs = require('fs');


/* GET users listing. */
router.get('/', function(req, res, next) {
  var currentDir =  dir;
  var query = req.query.path || '';
  if (query) currentDir = path.join(dir, query);
  //fs.statSync(currentDir)
  if(path.extname(query)=='.mp4'){
      const path = currentDir;
      const stat = fs.statSync(path);
      const fileSize = stat.size;
      const range = req.headers.range;
      if (range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1]
        ? parseInt(parts[1], 10)
        : fileSize-1
        const chunksize = (end-start)+1
        const file = fs.createReadStream(path, {start, end})
        const head = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4',
        }
        res.writeHead(206, head);
        file.pipe(res);
      } else {
        const head = {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4',
        }
        res.writeHead(200, head)
        fs.createReadStream(path).pipe(res)
      }
  }
  else if(path.extname(query)=='.jpg'){

      const head = {
        'Content-Type': 'image/jpg',
      }
      res.writeHead(200, head);
      fs.createReadStream(currentDir).pipe(res);
  }
  else if(path.extname(query)=='.pdf'){

      const head = {
        'Content-Type': 'application/pdf',
      }
      res.writeHead(200, head);
      fs.createReadStream(currentDir).pipe(res);
  }
  else if(path.extname(query)=='.mp3'){

      const head = {
        'Content-Type': 'audio/mpeg',
      }
      res.writeHead(200, head);
      fs.createReadStream(currentDir).pipe(res);
  }
  else{
    res.download(currentDir);
  }
});

module.exports = router;
