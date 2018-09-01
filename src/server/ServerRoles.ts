import { DataNode, Role } from "../engine/Dataframework";
import * as Matter from 'matter-js'

export abstract class MatterRole implements Role {

  id: string;
  node: DataNode;

  abstract get name(): string;

  private _engine: Matter.Engine;

  get engine() {
    return this._engine;
  }

  set engine(engine: Matter.Engine) {
    let oldEngine = this._engine;
    this._engine = engine;
    this.engineUpdated(engine, oldEngine);
  }

  abstract engineUpdated(engine: Matter.Engine, oldEngine: Matter.Engine): void;

  updateRole(delta: number, node: DataNode): void {
  }
  removedFromNode(node: DataNode): void {
  }
  addedToNode(node: DataNode): void {
  }
}

export abstract class MatterBodyRole extends MatterRole {
  x: number;
  y: number;

  body: Matter.Body;

  constructor(x: number, y: number) {
    super();
    this.x = x;
    this.y = y;
  }


  engineUpdated(engine: Matter.Engine, oldEngine: Matter.Engine): void {
    this.body = this.createBody(engine);
    Matter.World.add(engine.world, this.body);
    // set initial position
    this.node.data('x', this.x);
    this.node.data('y', this.y);
  }

  abstract createBody(engine: Matter.Engine): Matter.Body

  updateRole(delta: number, node: DataNode): void {

  }
}

export class ShakyRole implements Role {
  node: DataNode;
  id: string;

  leftRight: boolean = false;

  get name() {
    return 'ShakyRole';
  }

  updateRole(delta: number, node: DataNode): void {
    if (node.data('x') === undefined || node.data('y') === undefined) {
      return;
    }
    console.log('updated');
    if (this.leftRight) {
      node.data('x', node.data('x') - 0.1 * delta);
    } else {
      node.data('x', node.data('x') + 0.1 * delta);
    }
  }

  removedFromNode(node: DataNode): void {
  }
  addedToNode(node: DataNode): void {
  }


}

export class MatterCircleBody extends MatterBodyRole {

  private _radius: number;

  get radius() {
    return this._radius;
  }

  get name() {
    return 'MatterCircleBody';
  }

  // TODO if radius set -> update matter circle object

  constructor(x: number, y: number, radius: number) {
    super(x, y);
    this._radius = radius;
  }

  createBody(engine: Matter.Engine): Matter.Body {
    return Matter.Bodies.circle(this.x, this.y, this.radius);
  }
}
