/**
 * Main entry for the server.
 * Creates a new Phaser game and initializes server.
 */
import * as Express from 'express';
import * as Path from 'path';

import { ServerGame } from './ServerMain';

// fix for matterjs
(<any>global).window = {};

let game = new ServerGame();


// create express app
const app = Express();

// use public from cmd dir
app.use(Express.static(Path.join('', 'public')));

app.use(function(req: any, res: any, next: any) {
  // link not found
  res.status(200).sendFile(__dirname + "/public/index.html");
  next();
});

// start express on different port then socket.io
app.listen(4680, function() {
  console.log('Listening on port 4680!');
  game.start();
});
