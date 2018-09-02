import * as SocketIO from 'socket.io';
import { NetworkController, Message, WorldUpdateData } from '../engine/Network';
import { WorldListener } from '../engine/World';
import { ServerGameInterface } from './ServerMain';
import { DataNode, DataNodeListener, Role } from '../engine/Dataframework';


/**
 * Part of the ServerNetworkController.
 * Listens to world and entity changes and caches them.
 * Changes are sent to clients through sendChanges().
 */
class WorldSynchronizer implements WorldListener, DataNodeListener {
  private network: ServerNetworkController;

  // only the latest world state is distrbuted to clients
  private changes: WorldUpdateData;

  constructor(network: ServerNetworkController) {
    this.network = network;
    this.resetChanges();
  }

  private resetChanges() {
    this.changes = {
      worldChanges: {
        addedEntities: {},
        removedEntitites: {}
      },
      entityChanges: {
        updatedData: {}
      }
    };
  }

  sendChanges() {
    // TODO send bulk message (message containing array)
    // inform clients about added entities
    this.network.io.emit('WorldUpdate', this.changes);

    this.resetChanges();
  }

  entityAdded(entity: DataNode) {
    // cache change
    this.changes.worldChanges.addedEntities[entity.data('id')] = entity.data();
    // listen to data changes of entity
    entity.addListener(this);
  }

  entityRemoved(entity: DataNode) {
    this.changes.worldChanges.removedEntitites[entity.data('id')] = entity.data();
    entity.removeListener(this);
  }

  addedRoleToNode(role: Role, node: DataNode): void {
  }

  dataUpdated(key: string, newValue: any, oldValue: any, entity: DataNode): void {
    // cache change
    this.changes.entityChanges.updatedData[entity.data('id')] = { key: key, value: newValue };
  }

}

export class ServerNetworkController extends NetworkController {
  io: SocketIO.Server;

  private clientsById: any = {};

  worldSynchronizer: WorldSynchronizer = new WorldSynchronizer(this);
  game: ServerGameInterface;

  constructor(port: number, game: ServerGameInterface) {
    super();
    if (game === undefined) {
      throw new Error('ServerNetworkController: game has to be defined.');
    }
    this.game = game;
    this.io = SocketIO(port);
    console.log('init server network');


    this.io.on('connection', socket => {
      this.handleNewConnection(socket);
    });

    this.registerWorldMessages();
    this.initNodeDataChangeListener();

    //this.io.listen(port);
    console.log('SocketIO listening on port %i', port);
  }

  private handleNewConnection(socket: SocketIO.Socket) {
    // store connection mapped by id
    this.clientsById[socket.id] = socket;

    console.log('New connection with id %s.', socket.id);

    socket.emit('message', { type: 'Handshake', data: { clientId: socket.id, version: 1 }});
    // TODO for safety: wait until handshake message has been recieved by client

    // create player for client
    let entityId = this.game.world.addEntity(this.game.world.entityFactory.produceFromType('player'));
    this.io.emit('player.entityId', { clientId: socket.id, entityId: entityId });

    // send simple sprite

    socket.on('event', data => {
      console.log('Recieved an event!', data);
    });
    socket.on('disconnect', () => {
      console.log('Client disconnected.');
      delete this.clientsById[socket.id];
    });
  }


  private registerWorldMessages() {
  }


  private initNodeDataChangeListener() {
    this.game.world.addListener(this.worldSynchronizer);
  }


}
