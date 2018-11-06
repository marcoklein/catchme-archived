import { World } from '../engine/World'
import { DataNode } from '../engine/Dataframework'

/**
 * Extends basic World with client specific behaviors and properties.
 */
export class ServerWorld extends World {

  constructor() {
    super();
  }


  entityAdded(entity: DataNode): void {
  }

  entityRemoved(entity: DataNode): void {
  }
}
