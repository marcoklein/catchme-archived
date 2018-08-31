import { World } from '../engine/World'
import { DataNode } from '../engine/Dataframework'
import { EntityFactory } from '../engine/EntityFactory'
import { SimpleSpriteProducer } from '../game/EntityProducers'
import { ClientGameInterface } from './ClientMain'
import { PhaserRole, SpriteRole } from '../game/Roles'

/**
 * Extends basic World with client specific behaviors and properties.
 */
export class ClientWorld extends World {
  private _gameScene: Phaser.Scene;

  get gameScene() {
    return this._gameScene;
  }

  constructor(gameScene: Phaser.Scene) {
    super(new EntityFactory());
    this._gameScene = gameScene;

    this.registerEntityProducers();
  }

  private registerEntityProducers() {
    this.entityFactory.registerProducer(
      'sprite', new SimpleSpriteProducer()
    );
  }

  entityAdded(entity: DataNode): void {
    // phaser entity?
    // TODO set sprite for all roles that implement the "PhaserRole"
    let spriteRoles = entity.getRolesByClass(PhaserRole);
    if (spriteRoles) {
      spriteRoles.forEach((role: PhaserRole) => {
        role.scene = this._gameScene;
      });
    }
  }
}
