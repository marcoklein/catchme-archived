import * as SocketIOClient from 'socket.io-client';
import { NetworkController, Message } from '../engine/Network';
import { World } from '../engine/World';
import { ClientWorld } from './ClientWorld';
import { ClientGame } from './ClientMain';
//const io = require('socket.io');


export interface ClientMessage extends Message {
  apply(data: any, world: ClientWorld): void;

}

export abstract class WorldMessage implements ClientMessage {
  data: any;
  type: string;

  constructor(data?: any) {
    this.data = data;
  }

  abstract apply(data: any, world: ClientWorld): void;
}

export namespace WorldMessages {
  export const WORLD_MESSAGE_PREFIX: string = 'WM.';
  export class AddEntity extends WorldMessage {
    static TYPE: string = WORLD_MESSAGE_PREFIX + 'AE';
    type = AddEntity.TYPE;

    apply(data: any, world: ClientWorld): void {
      console.log('Adding the entity: %s with data ', data.type, data.data);
      world.addEntity(world.entityFactory.produceFromType(data.type, data.data));
    }

  }
}

export class ClientNetworkController extends NetworkController {
  private socket: SocketIOClient.Socket;
  private clientId: string;

  game: ClientGame;

  constructor(url: string, game: ClientGame) {
    super();
    if (game === undefined) {
      throw new Error('ClientNetworkController: game has to be defined.');
    }
    this.game = game;
    this.socket = SocketIOClient(url, { path: '/api' });

    this.socket.on('connect', this.onConnect);
    this.socket.on('message', (message: any) => {
      this.onMessage(message);
    });
    this.socket.on('disconnect', this.onDisconnect);

    this.registerWorldMessages();
  }

  private registerWorldMessages() {
    this.registerMessage(WorldMessages.AddEntity.TYPE, WorldMessages.AddEntity);
  }

  onConnect() {
    console.log('Connected to server!');
  }

  onMessage(message: any) {
    console.log('Recieved event!', message);
    if (message.type === WorldMessages.AddEntity.TYPE) {
      console.log('Recieved add entity message!');
      new WorldMessages.AddEntity(message.data).apply(message.data, this.game.world);
    } else if (message.type === 'Handshake') {
      console.log('Recieved Handshake message:' + message.data);
      this.clientId = message.data.clientId;
    }
  }

  onDisconnect() {
    console.log('Disconnected from server!');
  }

}
