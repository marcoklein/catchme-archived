
const express = require('express');
const path = require('path');
import * as SocketIO from 'socket.io';

// create express app
const app = express();

// create server and init socket.io
let server = require('http').createServer(app);
let io = SocketIO(server, { path: '/api' });

io.on('connection', socket => {
  console.log('New connection with id %s.', socket.id);
  socket.emit('message', { type: 'Handshake', data: { clientId: socket.id, version: 1}});
  socket.on('event', data => {
    console.log('Recieved a message!', data);
  });
  socket.on('disconnect', () => {
    console.log('Client disconnected.');
  });
});

// all api calls are handled by socket.io
app.use('/api', (req: any, res: any, next: any) => {
  console.log('Recieved an API call!')
  next();
});

// use public from cmd dir
app.use(express.static(path.join('', 'public')));

app.use(function(req: any, res: any, next: any) {
  // link not found
  res.status(200).sendFile(__dirname + "/public/index.html");
  next();
});


server.listen(4680, function() {
  console.log('Listening on port 4680!');
});


/**
 * Server of a game.
 */
export class ServerMain {

}

export default new ServerMain();
