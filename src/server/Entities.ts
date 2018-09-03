import { DataNode } from "../engine/Dataframework";


/**
 * An Entity is a decorator for a DataNode to safely access data.
 */
export abstract class Entity {
  readonly node: DataNode;

  constructor(node: DataNode) {
    this.node = node;
  }

  getType() {
    return this.data('type');
  }

  data(key?: string, data?: any) {
    return this.node.data(key, data);
  }
}

export class PlayerEntity extends Entity {
  constructor(node: DataNode) {
    super(node);
  }

  getName() {
    return this.data('name');
  }
}
