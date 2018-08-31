import * as SocketIOClient from 'socket.io-client';
import { NetworkController, Message } from '../engine/Network';
import { World } from '../engine/World';
//const io = require('socket.io');


export abstract class WorldMessage implements Message {
  data: any;
  type: string;


  apply(data: any, controller: NetworkController): void {
    this.applyToWorld(data, controller.world);
  }

  abstract applyToWorld(data: any, world: World): void;

}

export namespace WorldMessages {
  export const WORLD_MESSAGE_PREFIX: string = 'WM.';
  export class AddEntity extends WorldMessage {
    static TYPE: string = WORLD_MESSAGE_PREFIX + 'AE';
    type = AddEntity.TYPE;

    applyToWorld(data: any, world: World): void {
      world.addEntity(world.entityFactory.produceFromType(data.type, data.data));
    }

  }
}

export class ClientNetworkController extends NetworkController {
  private socket: SocketIOClient.Socket;
  private clientId: string;

  constructor(url: string, world: World) {
    super(world);
    this.socket = SocketIOClient(url, { path: '/api' });

    this.socket.on('connect', this.onConnect);
    this.socket.on('event', this.onEvent);
    this.socket.on('disconnect', this.onDisconnect);

    this.registerWorldMessages();
  }

  private registerWorldMessages() {
    this.registerMessage(WorldMessages.AddEntity.TYPE, WorldMessages.AddEntity);
  }

  onConnect() {
    console.log('Connected to server!');
  }

  onEvent(data: any) {
    console.log('Recieved message:', data);
  }


  onDisconnect() {
    console.log('Disconnected from server!');
  }

}
