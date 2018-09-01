import { EntityFactory } from './EntityFactory'
import { DataNode } from './Dataframework'

export interface WorldController {
  initialize(world: World): any;
  update(delta: number): any;
  cleanup(world: World): any;
}

export interface WorldListener {
  entityAdded(entity: DataNode): any;
  entityRemoved(entity: DataNode): any;
}

/**
 * Holds all information about ongoing game.
 * Has to be extended to realize either a server, client or local implementation.
 */
export abstract class World {
  private _entityFactory: EntityFactory;
  private _entities: Array<DataNode> = [];
  private _entitiesById: any = {};
  private _controllers: Array<WorldController> = [];
  private _listeners: Array<WorldListener> = [];

  get entityFactory() {
    return this._entityFactory;
  }

  constructor(entityFactory: EntityFactory) {
    this._entityFactory = entityFactory;
  }

  addListener(listener: WorldListener) {
    this._listeners.push(listener);
  }

  addController(controller: WorldController) {
    this._controllers.push(controller);
    controller.initialize(this);
  }

  getEntityById(id: string): DataNode {
    return this._entitiesById[id];
  }

  addEntity(entity: DataNode, id?: string) {
    this._entitiesById[id] = entity;
    // generate entity id
    this._entities.push(entity);
    // store entity

    // notify listeners
    this._listeners.forEach(listener => {
      listener.entityAdded(entity);
    });

    this.entityAdded(entity);
  }

  update(delta: number) {
    this._entities.forEach(entity => {
      entity.update(delta);
    });
    this._controllers.forEach(controller => {
      controller.update(delta);
    });
  }

  abstract entityAdded(entity: DataNode): void;

}
