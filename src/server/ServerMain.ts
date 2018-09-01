/**
 * The server uses Matter.js to simulate physics on the server.
 */
import * as Matter from 'matter-js'

import { ServerWorld } from './ServerWorld';
import { ServerNetworkController } from './ServerNetworkController';
import { WorldListener } from '../engine/World';
import { DataNode } from '../engine/Dataframework';
import { MatterRole } from './ServerRoles';

export interface ServerGameInterface {
  network: ServerNetworkController,
  world: ServerWorld,
  engine: Matter.Engine
}

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
  }

  private init() {
    // init matter
    this.engine = Matter.Engine.create();

    let testBox = Matter.Bodies.rectangle(400, 200, 80, 80);
    Matter.World.add(this.engine.world, testBox);
    Matter.Engine.run(this.engine);

    Matter.Events.on(this.engine, 'tick', () => {
      console.log('tick');
    });

    // init world and network
    this.world = new ServerWorld();
    this.network = new ServerNetworkController(4681, this);


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
