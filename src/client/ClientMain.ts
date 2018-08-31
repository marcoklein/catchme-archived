/// <reference path="../../devDependencies/phaser.d.ts"/>

import * as Phaser from 'phaser';
import { MainScene } from './scenes/MainScene';

import { ClientWorld } from './ClientWorld';
import { ClientNetworkController } from './ClientNetworkController';

// main game configuration
const config: GameConfig = {
  width: 800,
  height: 600,
  type: Phaser.AUTO,
  parent: "game",
  scene: MainScene,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 }
    }
  }
};

// game class
class Game extends Phaser.Game {

  private network: ClientNetworkController;
  private world: ClientWorld;

  constructor(config: GameConfig) {
    super(config);

    this.world = new ClientWorld();
    this.network = new ClientNetworkController('http://localhost:4680', this.world);
  }

  create() {
  }
}


// when the page is loaded, create our game instance
window.onload = () => {
  var game = new Game(config);
};
