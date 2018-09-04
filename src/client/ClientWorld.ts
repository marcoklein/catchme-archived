import { World } from '../engine/World'
import { DataNode } from '../engine/Dataframework'
import { PhaserRole } from './ClientRoles';

/**
 * Extends basic World with client specific behaviors and properties.
 */
export class ClientWorld extends World {

  private _gameScene: Phaser.Scene;
  clientEntity: DataNode;

  get gameScene() {
    return this._gameScene;
  }

  constructor(gameScene: Phaser.Scene) {
    super();
    this._gameScene = gameScene;

    //this.registerEntityProducers();
  }

  /*private registerEntityProducers() {
    this.entityFactory.registerProducer(
      'sprite', new SimpleSpriteProducer()
    );
    this.entityFactory.registerProducer(
      'player', new PlayerProducer()
    );
  }*/

  entityAdded(entity: DataNode): void {
    // phaser entity?
    // TODO set sprite for all roles that implement the "PhaserRole"
    let spriteRoles = entity.getRolesByClass(PhaserRole);
    if (spriteRoles) {
      spriteRoles.forEach((role: PhaserRole) => {
        role.scene = this._gameScene;
      });
    }
    // TODO add listener to entity to call phaser if new entity was added before
  }

  entityRemoved(entity: DataNode): void {
  }
}
