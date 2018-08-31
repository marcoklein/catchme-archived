import { World } from '../engine/World'
import { DataNode } from '../engine/Dataframework'
import { EntityFactory } from '../engine/EntityFactory'
import { SimpleSpriteProducer } from '../game/EntityProducers'
import { ClientGame } from './ClientMain'
import { SpriteRole } from '../game/Roles'


export class ClientWorld extends World {
  private _clientGame: ClientGame;

  get clientGame() {
    return this._clientGame;
  }

  constructor(clientGame: ClientGame) {
    super(new EntityFactory());
    this._clientGame = clientGame;

    this.registerEntityProducers();
  }

  private registerEntityProducers() {
    this.entityFactory.registerProducer(
      'sprite', new SimpleSpriteProducer()
    );
  }

  entityAdded(entity: DataNode): void {
    // phaser entity?
    let spriteRole = entity.getRoleByName('Sprite');
    if (spriteRole) {
      (<SpriteRole> spriteRole).sprite = this._clientGame.scene.getScene('MainScene').add.sprite(100, 100, '');
    }
  }
}
