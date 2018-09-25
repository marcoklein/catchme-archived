/**
 * Main entry for the server.
 * Creates a new Phaser game and initializes server.
 */
import * as Express from 'express';
import * as Path from 'path';

import { ServerGame } from './ServerMain';
import { TestGame } from '../game/basic/ClassicGame';
import * as http from 'http';


// create express app
const app = Express();

let server = new http.Server(app);

let game = new ServerGame(server);



// use public from cmd dir
app.use(Express.static(Path.join(__dirname, '../../public')));

/*app.use(function(req: any, res: any, next: any) {
  // link not found
  res.status(200).sendFile(__dirname + "/public/index.html");
  next();
});*/

// start express on different port then socket.io
server.listen(4680, function() {
  console.log('Listening on port 4680!');
});

game.start(new TestGame());
