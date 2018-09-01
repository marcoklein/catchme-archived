import { World } from '../engine/World'
import { DataNode } from '../engine/Dataframework'
import { EntityFactory } from '../engine/EntityFactory'
import { SimpleSpriteProducer } from '../game/EntityProducers'
import { ServerGameInterface } from './ServerMain'
import { PhaserRole, SpriteRole } from '../game/Roles'

/**
 * Extends basic World with client specific behaviors and properties.
 */
export class ServerWorld extends World {


  constructor() {
    super(new EntityFactory());

    this.registerEntityProducers();
  }

  private registerEntityProducers() {
    this.entityFactory.registerProducer(
      'sprite', new SimpleSpriteProducer()
    );
  }

  entityAdded(entity: DataNode): void {
  }
}
