/**
 * Main entry for the server.
 * Creates a new Phaser game and initializes server.
 */

const express = require('express');
const path = require('path');


// create express app
const app = express();

// use public from cmd dir
app.use(express.static(path.join('', 'public')));

app.use(function(req: any, res: any, next: any) {
  // link not found
  res.status(200).sendFile(__dirname + "/public/index.html");
  next();
});


app.listen(4680, function() {
  console.log('Listening on port 4680!');
});

require('./ServerMain');
