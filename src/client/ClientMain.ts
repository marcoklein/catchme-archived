/// <reference path="../../devDependencies/phaser.d.ts"/>

import * as Phaser from 'phaser';
import { GameScene } from './scenes/GameScene';

import { ClientWorld } from './ClientWorld';
import { ClientNetworkController } from './ClientNetworkController';
import { ClientEntityFactory } from './ClientEntityFactory';

// main game configuration
const config: GameConfig = {
  width: 800,
  height: 600,
  type: Phaser.AUTO,
  parent: "game",
  scene: GameScene,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 }
    }
  }
};

export interface ClientGameInterface {
  network: ClientNetworkController,
  world: ClientWorld,
  entityFactory: ClientEntityFactory
}

// game class
export class ClientMain extends Phaser.Game {


  constructor(config: GameConfig) {
    super(config);

  }


}

// when the page is loaded, create our game instance
window.onload = () => {
  var game = new ClientMain(config);
};
