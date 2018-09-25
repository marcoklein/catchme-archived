import * as SocketIO from 'socket.io';
import * as http from 'http';
import { NetworkController, Message, WorldChanges, UserActions } from '../engine/Network';
import { WorldListener } from '../engine/World';
import { ServerGameInterface } from './ServerMain';
import { DataNode, DataNodeListener, Role } from '../engine/Dataframework';


export class HostedConnection {
  private network: ServerNetworkController;
  name: string;
  id: string;
  readonly socket: SocketIO.Socket;

  private _entityId: string;

  constructor(network: ServerNetworkController, socket: SocketIO.Socket, name: string) {
    this.socket = socket;
    this.network = network;
    this.id = socket.id;
    this.name = name;
  }


  set entityId(entityId) {
    // notify client about change
    this.socket.emit('player.entityId', entityId);
    this._entityId = entityId;
  }

  get entityId(): string {
    return this._entityId;
  }

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

  clientsById: {[id: string]: HostedConnection} = {};

  private messageNum: number = 0;

  worldSynchronizer: WorldSynchronizer = new WorldSynchronizer(this);
  game: ServerGameInterface;

  constructor(server: http.Server, game: ServerGameInterface) {
    super();
    if (game === undefined) {
      throw new Error('ServerNetworkController: game has to be defined.');
    }
    this.game = game;
    this.io = SocketIO(server);
    console.log('init server network');


    this.io.on('connection', socket => {
      this.handleNewConnection(socket);
    });

    this.initNodeDataChangeListener();

    //this.io.listen(port);
    //console.log('SocketIO listening on port %i', port);
  }

  sendWorldUpdate(changes: WorldChanges) {
    // send message number with message
    changes.num = this.messageNum;
    this.messageNum++;
    this.io.emit('WorldUpdate', changes);
  }

  private handleNewConnection(socket: SocketIO.Socket) {

    console.log('New connection with id %s.', socket.id);

    socket.emit('message', { type: 'Handshake', data: { clientId: socket.id, version: 1 }});
    // TODO for safety: wait until handshake message has been recieved by client

    socket.on('ready', (event: any) => {

      // store connection mapped by id
      let connection = new HostedConnection(this, socket, event.name || '<noname>');
      this.clientsById[socket.id] = connection;

      socket.on('PlayerActions', (actions: UserActions) => {
        this.handlePlayerActions(socket, actions);
      });

      // send initial world data
      socket.emit('WorldUpdate', {
        addedEntities: this.game.world.getEntitiesData()
      });

      // notify game mode about joined client
      this.game.mode.clientJoined(connection);

    });

    socket.on('disconnect', () => {
      console.log('Client disconnected.');
      delete this.clientsById[socket.id];
      // TODO delete player entity and tell game mode
    });
  }

  private handlePlayerActions(socket: SocketIO.Socket, actions: UserActions) {
    console.log('Player actions: ', actions);

    // notify game mode
    this.game.mode.userActions(this.clientsById[socket.id], actions);

  }


  private initNodeDataChangeListener() {
    this.game.world.addListener(this.worldSynchronizer);
  }


}
