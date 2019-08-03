const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const keypressHandler = require('./keypressHandler');
const messageQueue = require('./messageQueue')

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

// let messageQueue = null;
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
  res.end();

  next(); // invoke next() at the end of a request to help with testing!
};
