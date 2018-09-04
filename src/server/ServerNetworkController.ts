import * as SocketIO from 'socket.io';
import { NetworkController, Message, WorldChanges } from '../engine/Network';
import { WorldListener } from '../engine/World';
import { ServerGameInterface } from './ServerMain';
import { DataNode, DataNodeListener, Role } from '../engine/Dataframework';


export interface HostedConnection {
  name: string;
  id: string;
}

/**
 * Part of the ServerNetworkController.
 * Listens to world and entity changes and caches them.
 * Changes are sent to clients through sendChanges().
 */
class WorldSynchronizer implements WorldListener, DataNodeListener {
  private network: ServerNetworkController;

  // only the latest world state is distrbuted to clients
  private changes: WorldChanges;

  constructor(network: ServerNetworkController) {
    this.network = network;
    this.resetChanges();
  }

  private resetChanges() {
    this.changes = {
      addedEntities: [],
      removedEntitites: [],
      updatedData: []
    };
  }

  sendChanges() {
    // TODO send bulk message (message containing array)
    // inform clients about added entities
    this.network.sendWorldUpdate(this.changes);

    this.resetChanges();
  }

  entityAdded(entity: DataNode) {
    // cache change
    this.changes.addedEntities.push(entity.data());
    // listen to data changes of entity
    entity.addListener(this);
  }

  entityRemoved(entity: DataNode) {
    this.changes.removedEntitites.push(entity.data());
    entity.removeListener(this);
  }

  addedRoleToNode(role: Role, node: DataNode): void {
  }

  dataUpdated(key: string, newValue: any, oldValue: any, entity: DataNode): void {
    // cache change
    this.changes.updatedData.push({ entityId: entity.data('id'), key: key, value: newValue });
  }

}

export class ServerNetworkController extends NetworkController {
  io: SocketIO.Server;

  private clientsById: any = {};

  private messageNum: number = 0;

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

    this.initNodeDataChangeListener();

    //this.io.listen(port);
    console.log('SocketIO listening on port %i', port);
  }

  sendWorldUpdate(changes: WorldChanges) {
    // send message number with message
    changes.num = this.messageNum;
    this.messageNum++;
    this.io.emit('WorldUpdate', changes);
  }

  private handleNewConnection(socket: SocketIO.Socket) {
    // store connection mapped by id
    this.clientsById[socket.id] = socket;

    console.log('New connection with id %s.', socket.id);

    socket.emit('message', { type: 'Handshake', data: { clientId: socket.id, version: 1 }});
    // TODO for safety: wait until handshake message has been recieved by client

    socket.on('ready', (event: any) => {

      // send initial world data
      socket.emit('WorldUpdate', {
        addedEntities: this.game.world.getEntitiesData()
      });


      // create player for client
      //let entityId = this.game.world.addEntity(this.game.world.entityFactory.produceFromType('player'));

      // tell client, that this is his entity so he can control it
      //this.io.emit('player.entityId', { clientId: socket.id, entityId: entityId });

      this.game.mode.clientJoined({id: socket.id, name: '<noname>'});

    });

    socket.on('disconnect', () => {
      console.log('Client disconnected.');
      delete this.clientsById[socket.id];
      // TODO delete player entity and tell game mode
    });
  }


  private initNodeDataChangeListener() {
    this.game.world.addListener(this.worldSynchronizer);
  }


}
