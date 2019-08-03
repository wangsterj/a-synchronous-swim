const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const keypressHandler = require('./keypressHandler');
// const messageQueue = require('./messageQueue')
const { parse } = require('querystring');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

module.exports.router = (req, res, next = ()=>console.log("Server received client request!")) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  // console.log(req._postData);
  res.writeHead(200, headers);
  // let directions = [ 'left', 'right', 'up', 'down' ];
  // let index = Math.floor(Math.random()*4);
  // res.end( directions[index] );


  if (req.method === 'GET') {
    if (req.url.slice(1) === 'command') {
      var message = messageQueue();
      // if get request is to get swim command
      if (message !== undefined) {
        res.end(message);
      }
      res.end()
    } else {
      var filename = __dirname+req.url;

      fs.access(filename, fs.F_OK, (err) => {
        if (err) {
          res.writeHead(404, headers);
          console.error(err)
          return
        }// This line opens the file as a readable stream
        var readStream = fs.createReadStream(filename);

        // This will wait until we know the readable stream is actually valid before piping
        readStream.on('open', function () {
          readStream.pipe(res);
        });
      })
      next();
    }
  }

  if (req.method === "OPTIONS" ){
    res.end();
  }

  if (req.method === 'POST') {
    let body = new Buffer('');
    req.on('data', chunk => {
        body = Buffer.concat([body, chunk]);
    });
    // console.log(body)
    req.on('end', () => {
      var img = multipart.getFile(body);
      console.log(img.data)
      var filename = __dirname+req.url;
      console.log(filename)
      fs.writeFile(filename, img.data, (err) => {
        if (err) {
          throw err;
        }
        console.log("File saved!")
      })
    });
    res.end();
  }
  // res.end();

  next(); // invoke next() at the end of a request to help with testing!
};