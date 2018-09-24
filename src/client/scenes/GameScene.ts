
import * as Phaser from 'phaser';

import { ClientGameInterface } from '../ClientMain';
import { ClientWorld } from '../ClientWorld';
import { ClientNetworkController } from '../ClientNetworkController';
import { ClientEntityFactory, ClientEntityProducer } from '../ClientEntityFactory';
import { CLIENT_ENTITY_PRODUCERS } from '../../game/basic/ClientEntities';

/** Test Scene */
export class GameScene extends Phaser.Scene implements ClientGameInterface {
  private phaserSprite: Phaser.GameObjects.Sprite;

  private _network: ClientNetworkController;
  private _world: ClientWorld;
  private _entityFactory: ClientEntityFactory;

  // for user input
  upKey: Phaser.Input.Keyboard.Key;
  leftKey: Phaser.Input.Keyboard.Key;
  downKey: Phaser.Input.Keyboard.Key;
  rightKey: Phaser.Input.Keyboard.Key;

  moveDirection: Phaser.Math.Vector2 = new Phaser.Math.Vector2();
  lastMoveDirection: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0);




  get entityFactory() {
    return this._entityFactory;
  }

  constructor() {
    super({
      key: "GameScene"
    });

  }

  update(time: number, delta: number): void {
    // update world
    this._world.update(delta);

    this.handleUserInput();
  }

  preload(): void {
    this.load.image('test-sprite', 'assets/images/sprite.png');
    this.load.image('characterBlue', 'assets/images/characterBlue.png');
    this.load.image('particle-catcher', 'assets/sprites/particle_catcher.png');
  }

  create(): void {
    //var sprite = this.add.sprite(50, 300, 'test-sprite');

    this._world = new ClientWorld(this);
    this._network = new ClientNetworkController('http://kleinprojects:4681', this);
    this._entityFactory = new ClientEntityFactory();

    // load entities
    CLIENT_ENTITY_PRODUCERS.forEach((producer: ClientEntityProducer) => {
      this._entityFactory.registerProducer(producer.type, producer);
    });

    // init user input
    this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

  }


  handleUserInput() {

    this.moveDirection.set(0, 0);
    // calculate move direction
    if (this.upKey.isDown) {
      this.moveDirection.y -= 1;
    }
    if (this.leftKey.isDown) {
      this.moveDirection.x -= 1;
    }
    if (this.downKey.isDown) {
      this.moveDirection.y += 1;
    }
    if (this.rightKey.isDown) {
      this.moveDirection.x += 1;
    }

    // only send update if move direction changed
    if (!this.moveDirection.equals(this.lastMoveDirection)) {
      this.lastMoveDirection.copy(this.moveDirection);
      // send user input to server
      this._network.sendUserActions({
        mX: this.moveDirection.x,
        mY: this.moveDirection.y
      });
      console.log('sent update move direction');
    }


  }


  get world() {
    return this._world;
  }

  get network() {
    return this._network;
  }
}
