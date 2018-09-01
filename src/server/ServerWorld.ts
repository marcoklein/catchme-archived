import { World } from '../engine/World'
import { DataNode } from '../engine/Dataframework'
import { EntityFactory } from '../engine/EntityFactory'
import { PlayerProducer } from './ServerEntityProducer'
import { ServerGameInterface } from './ServerMain'

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
      'player', new PlayerProducer()
    );
  }

  entityAdded(entity: DataNode): void {
  }
}
