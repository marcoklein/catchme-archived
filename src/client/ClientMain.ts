/// <reference path="../phaser.d.ts"/>

import Phaser = require('phaser');
import { MainScene } from './scenes/MainScene';

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
export default class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }

  create() {
  }
}

// when the page is loaded, create our game instance
window.onload = () => {
  var game = new Game(config);
};
