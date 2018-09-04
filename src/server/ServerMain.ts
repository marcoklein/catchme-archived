 // fix for matterjs -> accesses window variable
 (<any> global).window = {};

import * as Matter from 'matter-js'

import { ServerWorld } from './ServerWorld';
import { ServerNetworkController, HostedConnection } from './ServerNetworkController';
import { WorldListener } from '../engine/World';
import { DataNode } from '../engine/Dataframework';
import { MatterRole } from './ServerRoles';

export interface GameMode {

  startGame(game: ServerGameInterface): void;
  update(delta: number): void;
  finishGame(): void;

  clientJoined(client: HostedConnection): void;
  clientLeft(client: HostedConnection): void;

  // TODO add collision detection from https://github.com/dxu/matter-collision-events

}

export class GameHelper {
  readonly game: ServerGameInterface;

  constructor(game: ServerGameInterface) {
    this.game = game;
  }

  /**
   * Creates world boundaries by adding one box on each side.
   */
  createWorldBoundaries(minX: number, minY: number, maxX: number, maxY: number) {
    console.warn('createWorldBoundaries uses default values.');
    Matter.World.add(this.game.engine.world, [
      Matter.Bodies.rectangle(400, 600, 1200, 50.5, { isStatic: true })
    ]);
  }

}

/**
 * Basic requirements for a ServerGame.
 */
export interface ServerGameInterface {
  mode: GameMode,
  network: ServerNetworkController,
  world: ServerWorld,
  engine: Matter.Engine
}

/**
 * The server uses Matter.js to simulate physics on the server.
 */
export class ServerGame implements ServerGameInterface {
  mode: GameMode;
  world: ServerWorld;
  network: ServerNetworkController;
  // physics
  engine: Matter.Engine;

  constructor() {
  }

  start(gameMode: GameMode) {
    this.mode = gameMode;
    console.log('Started ServerGame.');
    this.init();

    // start game mode
    this.mode.startGame(this);


    // start runner
    Matter.Engine.run(this.engine);
  }

  private init() {
    // init matter
    this.engine = Matter.Engine.create();
    this.engine.world.gravity.x = 0.00;
    this.engine.world.gravity.y = 0.00;


    // init world and network
    this.world = new ServerWorld();
    this.network = new ServerNetworkController(4681, this);

    // listen to update events and update
    let lastTimestamp = 0;
    let lastNetworkSync = 0;
    let networkSyncInterval = 50;
    Matter.Events.on(this.engine, 'tick', event => {
      // update game
      let delta = event.timestamp - lastTimestamp;
      this.world.update(delta);

      // update game mode
      this.mode.update(delta);

      // do network sync every network sync interval
      lastNetworkSync -= delta;
      if (lastNetworkSync <= 0) {
        lastNetworkSync = networkSyncInterval;
        this.network.worldSynchronizer.sendChanges();
      }

      lastTimestamp = event.timestamp;

    });

    this.initWorldListener();
  }

  private initWorldListener() {
    let self = this;
    // sync with engine
    this.world.addListener(<WorldListener> {
      entityAdded(entity: DataNode) {
        entity.getRolesByClass(MatterRole).forEach((role: MatterRole) => {
          role.engine = self.engine;
        });
      }
    });
  }

}
