import { EntityFactory } from './EntityFactory'
import { DataNode } from './Dataframework'

/**
 * Holds all information about ongoing game.
 * Has to be extended to realize either a server, client or local implementation.
 */
export abstract class World {
  private _entityFactory: EntityFactory;

  get entityFactory() {
    return this._entityFactory;
  }
  
  addEntity(entity: DataNode) {

  }

}
