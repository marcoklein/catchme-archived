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
export class ClientGame extends Phaser.Game {

  private network: ClientNetworkController;
  private _world: ClientWorld;

  constructor(config: GameConfig) {
    super(config);

    this._world = new ClientWorld(this);
    this.network = new ClientNetworkController('http://localhost:4680', this);
  }

  get world() {
    return this._world;
  }

  preload() {
  }

  create() {
  }
}

// when the page is loaded, create our game instance
window.onload = () => {
  var game = new ClientGame(config);
};
