/// <reference path="../../devDependencies/phaser.d.ts"/>

import * as Phaser from 'phaser';
import { GameScene } from './scenes/GameScene';

import { ServerWorld } from './ServerWorld';
import { ServerNetworkController } from './ServerNetworkController';
import * as express from 'express';
import * as path from 'path';

const window: any = {};

// main game configuration
const config: GameConfig = {
  type: Phaser.HEADLESS,
  //parent: "game",
  scene: GameScene,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 }
    }
  }
};

export interface ServerGameInterface {
  network: ServerNetworkController,
  world: ServerWorld
}

// game class
export class ServerMain extends Phaser.Game {


  constructor(config: GameConfig) {
    super(config);

  }

  create() {
    console.log('Created ServerMain');
    let app = express();

    // use public from cmd dir
    app.use(express.static(path.join('', 'public')));

    app.use(function(req: any, res: any, next: any) {
      // link not found
      res.status(200).sendFile(__dirname + "/public/index.html");
      next();
    });

    app.listen(4680, () => {
      console.log('Webpage is listening on port 4680!');
    });
  }

}

export default new ServerMain(config);

// when the page is loaded, create our game instance
/*window.onload = () => {
  var game = new ServerMain(config);
};*/
