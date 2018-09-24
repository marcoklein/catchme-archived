import * as SocketIOClient from 'socket.io-client';
import { NetworkController, Message, WorldChanges, UserActions } from '../engine/Network';
import { World, WorldController, WorldListener } from '../engine/World';
import { ClientGameInterface } from './ClientMain';
import { DataNode } from '../engine/Dataframework';

export class ClientNetworkController extends NetworkController implements WorldController {
  private socket: SocketIOClient.Socket;
  private clientId: string;
  private entityId: string;

  /**
   * True if client has recieved all initial world changes.
   */
  private worldInitialized: boolean = false;
  /**
   * Arriving world changes are cached, until the initialization message is recieved.
   */
  private cachedChanges: WorldChanges[] = [];

  // to sync player movement
  private lastMoveDir: Phaser.Math.Vector2 = new Phaser.Math.Vector2();

  game: ClientGameInterface;

  constructor(url: string, game: ClientGameInterface) {
    super();
    if (game === undefined) {
      throw new Error('ClientNetworkController: game has to be defined.');
    }
    this.game = game;
    this.socket = SocketIOClient(url);

    this.socket.on('connect', () => this.onConnect);
    this.socket.on('message', (message: any) => {
      this.onMessage(message);
    });
    this.socket.on('disconnect', this.onDisconnect);
    this.socket.on('player.entityId', (entityId: string) => {
      this.setEntityId(entityId);
    });
    this.socket.on('WorldUpdate', (changes: WorldChanges) => {
      if (this.worldInitialized === false) {
        if (changes.num !== undefined) {
          // wait for initialization message
          this.cachedChanges.push(changes);
        } else {
          this.worldInitialized = true;
          this.applyWorldChanges(changes);
          // apply cached changes
          this.cachedChanges.forEach(changes => {
            this.applyWorldChanges(changes);
          });
        }
      } else {
        this.applyWorldChanges(changes);
      }
    });

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
    /*let moveDir = this.playerControl.moveDirection;
    if (!moveDir.equals(this.lastMoveDir)) {
      this.lastMoveDir.set(moveDir.x, moveDir.y);
      // send move direction
      this.socket.emit('player-update', { moveDir: moveDir });
    }*/
  }

  cleanup(world: World) {
  }

  sendUserActions(actions: UserActions) {
    this.socket.emit('PlayerActions', actions);
  }

  /**
   * Called as an update world message is recieved through socket io.
   */
  private applyWorldChanges(changes: WorldChanges) {
    let world = this.game.world;
    // apply added entities
    if (changes.addedEntities) {
      changes.addedEntities.forEach(data => {
        world.addEntity(this.game.entityFactory.produceFromType(data.type, data));
      });
    }
    // update
    if (changes.updatedData) {
      changes.updatedData.forEach(data => {
        world.getEntityById(data.entityId).data(data.key, data.value);
      });
    }
    // remove entities at the end because data changes might affect removed entities
    if (changes.removedEntitites) {
      changes.removedEntitites.forEach(id => {
        world.removeEntityById(id);
      });
    }
  }

  onConnect() {
    console.log('Connected to server!');
  }

  onMessage(message: any) {
    console.log('Recieved event!', message);
    if (message.type === 'Handshake') {
      console.log('Recieved Handshake message:' + message.data);
      this.clientId = message.data.clientId;
      this.socket.emit('ready', { name: 'client name' }); // tell server that we are ready
    } else {
      console.error('Unhandled message with type %s', message.type);
    }
  }

  onDisconnect() {
    console.log('Disconnected from server!');
  }

}
