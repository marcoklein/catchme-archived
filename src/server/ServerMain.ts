 // fix for matterjs -> accesses window variable
 (<any> global).window = {};

import * as Matter from 'matter-js'

import { ServerWorld } from './ServerWorld';
import { ServerNetworkController } from './ServerNetworkController';
import { WorldListener } from '../engine/World';
import { DataNode } from '../engine/Dataframework';
import { MatterRole } from './ServerRoles';

/**
 * Basic requirements for a ServerGame.
 */
export interface ServerGameInterface {
  network: ServerNetworkController,
  world: ServerWorld,
  engine: Matter.Engine
}

/**
 * The server uses Matter.js to simulate physics on the server.
 */
export class ServerGame implements ServerGameInterface {
  world: ServerWorld;
  network: ServerNetworkController;
  // physics
  engine: Matter.Engine;

  constructor() {
  }

  start() {
    console.log('Started ServerGame.');
    this.init();
    // start runner
    Matter.Engine.run(this.engine);
  }

  private init() {
    // init matter
    this.engine = Matter.Engine.create();
    //this.engine.world.gravity.x = 0.01;
    //this.engine.world.gravity.y = 0.00;

    Matter.World.add(this.engine.world, Matter.Bodies.rectangle(400, 600, 1200, 50.5, { isStatic: true }));

    // init world and network
    this.world = new ServerWorld();
    this.network = new ServerNetworkController(4681, this);

    // listen to update events and update
    let lastTimestamp = 0;
    let lastNetworkSync = 0;
    let networkSyncInterval = 100;
    Matter.Events.on(this.engine, 'tick', event => {
      // update game
      let delta = event.timestamp - lastTimestamp;
      this.world.update(delta);
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
        console.log('entity added');
        entity.getRolesByClass(MatterRole).forEach((role: MatterRole) => {
          role.engine = self.engine;
        });
      }
    });
  }

}
