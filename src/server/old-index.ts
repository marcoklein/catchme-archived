/**
 * Main entry for the server.
 * Creates a new Phaser game and initializes server.
 */
//require('./ServerMain');


const express = require('express');
const path = require('path');
import * as SocketIO from 'socket.io';

import { Message } from '../engine/Network'

// create express app
const app = express();

// create server and init socket.io
let server = require('http').createServer(app);
let io = SocketIO(server, { path: '/api' });


io.on('connection', socket => {
  console.log('New connection with id %s.', socket.id);
  socket.emit('message', { type: 'Handshake', data: { clientId: socket.id, version: 1 }});
  // send entity id of player
  socket.emit('player.entityId', '1');
  // send simple sprite
  socket.emit('message', { type: 'WM.AE', data: { type: 'sprite', data: { id: '1', x: 200, y: 200, image: 'test-sprite' }}});

  socket.on('event', data => {
    console.log('Recieved a message!', data);
  });
  socket.on('player-update', data => {
    console.log('Recieved a player update!', data);
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


app.listen(4680, function() {
  console.log('Listening on port 4680!');
});
