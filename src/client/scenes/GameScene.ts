
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
      key: "GameScene"
    });

  }

  update(time: number, delta: number): void {
    // update world
    this._world.update(delta);
  }

  preload(): void {
    this.load.image('test-sprite', 'assets/images/sprite.png');
  }

  create(): void {
    var sprite = this.add.sprite(50, 300, 'test-sprite');

    this._world = new ClientWorld(this);
    this._network = new ClientNetworkController('http://localhost:4681', this);

  }


  get world() {
    return this._world;
  }

  get network() {
    return this._network;
  }
}
