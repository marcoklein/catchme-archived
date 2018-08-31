
import * as Phaser from 'phaser';

import { ClientGameInterface } from '../ClientMain';
import { ClientWorld } from '../ClientWorld';
import { ClientNetworkController } from '../ClientNetworkController';

/** Test Scene */
export class GameScene extends Phaser.Scene implements ClientGameInterface {
  private phaserSprite: Phaser.GameObjects.Sprite;

  private _network: ClientNetworkController;
  private _world: ClientWorld;

  constructor() {
    super({
      key: "WorldScene"
    });

  }


  preload(): void {
    //this.load.image("logo", "./assets/boilerplate/phaser.png");
    this.load.image('test-sprite', 'assets/images/sprite.png');
  }

  create(): void {
    //this.phaserSprite = this.add.sprite(400, 300, "logo");
    var sprite = this.add.sprite(50, 300, 'test-sprite');

    this._world = new ClientWorld(this);
    this._network = new ClientNetworkController('http://localhost:4680', this);


    /*var text = "super text";
    var style = { font: "16px Arial", fill: "#00ff44", align: "center" };

    var t = this.add.text(300, 0, text, style);*/
  }

  get world() {
    return this._world;
  }

  get network() {
    return this._network;
  }
}
