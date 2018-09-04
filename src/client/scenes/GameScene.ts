
import * as Phaser from 'phaser';

import { ClientGameInterface } from '../ClientMain';
import { ClientWorld } from '../ClientWorld';
import { ClientNetworkController } from '../ClientNetworkController';
import { ClientEntityFactory, ClientEntityProducer } from '../ClientEntityFactory';
import { CLIENT_ENTITY_PRODUCERS } from '../../game/ClientEntities';

/** Test Scene */
export class GameScene extends Phaser.Scene implements ClientGameInterface {
  private phaserSprite: Phaser.GameObjects.Sprite;

  private _network: ClientNetworkController;
  private _world: ClientWorld;
  private _entityFactory: ClientEntityFactory;

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
  }

  preload(): void {
    this.load.image('test-sprite', 'assets/images/sprite.png');
    this.load.image('characterBlue', 'assets/images/characterBlue.png');
  }

  create(): void {
    //var sprite = this.add.sprite(50, 300, 'test-sprite');

    this._world = new ClientWorld(this);
    this._network = new ClientNetworkController('http://localhost:4681', this);
    this._entityFactory = new ClientEntityFactory();

    // load entities
    CLIENT_ENTITY_PRODUCERS.forEach((producer: ClientEntityProducer) => {
      this._entityFactory.registerProducer(producer.type, producer);
    });

  }


  get world() {
    return this._world;
  }

  get network() {
    return this._network;
  }
}
