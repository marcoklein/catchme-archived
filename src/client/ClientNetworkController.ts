import * as SocketIOClient from 'socket.io-client';
import { NetworkController, Message, WorldUpdateData } from '../engine/Network';
import { World, WorldController, WorldListener } from '../engine/World';
import { ClientWorld } from './ClientWorld';
import { ClientGameInterface } from './ClientMain';
import { PlayerControl } from './ClientRoles';
import { DataNode } from '../engine/Dataframework';
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
      world.addEntity(world.entityFactory.produceFromType(data.type, data.data), data.data.id);
    }

  }
}

export class ClientNetworkController extends NetworkController implements WorldController {
  private socket: SocketIOClient.Socket;
  private clientId: string;
  private entityId: string;
  // to sync player movement
  private playerControl: PlayerControl;
  private lastMoveDir: Phaser.Math.Vector2 = new Phaser.Math.Vector2();

  game: ClientGameInterface;

  constructor(url: string, game: ClientGameInterface) {
    super();
    if (game === undefined) {
      throw new Error('ClientNetworkController: game has to be defined.');
    }
    this.game = game;
    this.socket = SocketIOClient(url);

    this.socket.on('connect', this.onConnect);
    this.socket.on('message', (message: any) => {
      this.onMessage(message);
    });
    this.socket.on('disconnect', this.onDisconnect);
    this.socket.on('player.entityId', (entityId: string) => {
      this.setEntityId(entityId);
    });
    this.socket.on('WorldUpdate', (changes: any) => {
      this.applyWorldChanges(changes);
    });

    this.registerWorldMessages();
  }

  private registerWorldMessages() {
    this.registerMessage(WorldMessages.AddEntity.TYPE, WorldMessages.AddEntity);
  }

  private setEntityId(entityId: string) {
    this.entityId = entityId;
    // TODO check if entity is already added to World
    this.game.world.addListener(<WorldListener> {
      entityAdded(entity: DataNode) {
        //if (entity.)
      }
    });
  }


  initialize(world: World) {
  }

  update(delta: number) {
    // sync player movement
    let moveDir = this.playerControl.moveDirection;
    if (!moveDir.equals(this.lastMoveDir)) {
      this.lastMoveDir.set(moveDir.x, moveDir.y);
      // send move direction
      this.socket.emit('player-update', { moveDir: moveDir });
    }
  }

  cleanup(world: World) {
  }

  /**
   * Called as an update world message is recieved through socket io.
   */
  private applyWorldChanges(changes: WorldUpdateData) {
    let world = this.game.world;
    // apply added entities
    for (let key in changes.worldChanges.addedEntities) {
      let data = changes.worldChanges.addedEntities[key];
      console.log('world update: adding entity', data);
      world.addEntity(world.entityFactory.produceFromType(data.type, data));
    }
    // apply data changes
    for (let entityId in changes.entityChanges.updatedData) {
      let data = changes.entityChanges.updatedData[entityId];
      world.getEntityById(entityId).data(data.key, data.value);
    }

    // remove entities at the end because data changes might affect removed entities
    for (let key in changes.worldChanges.removedEntitites) {
      let data = changes.worldChanges.removedEntitites[key];
      console.error('Removal of entities not yet supported.');
      // TODO implement entity removal
      //world.removeEntity();
    }
  }

  onConnect() {
    console.log('Connected to server!');
  }

  onMessage(message: any) {
    console.log('Recieved event!', message);
    if (message.type === WorldMessages.AddEntity.TYPE) {
      console.log('Recieved add entity message!');
      //new WorldMessages.AddEntity(message.data).apply(message.data, this.game.world);
    } else if (message.type === 'Handshake') {
      console.log('Recieved Handshake message:' + message.data);
      this.clientId = message.data.clientId;
    } else if (message.type === 'Data.U') {
      // entity data updated
      this.game.world.getEntityById(message.data.nodeId).data(message.data.key, message.data.value);
    } else if (message.type === 'Data.D') {
      // entity data deleted
      this.game.world.getEntityById(message.data.nodeId).data(message.data.key, undefined);
    }
  }

  onDisconnect() {
    console.log('Disconnected from server!');
  }

}
