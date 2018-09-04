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

export abstract class PhysicsRole extends MatterRole {

  body: Matter.Body;

  constructor() {
    super();
  }

  get x() {
    return this.node.data('x');
  }

  get y() {
    return this.node.data('y');
  }


  engineUpdated(engine: Matter.Engine, oldEngine: Matter.Engine): void {
    console.log('updating engine');
    this.body = this.createBody(this.x, this.y, engine);
    Matter.World.add(engine.world, this.body);
    // set initial position
    this.node.data('x', this.x);
    this.node.data('y', this.y);
    console.log('physics body created');
  }

  abstract createBody(x: number, y: number, engine: Matter.Engine): Matter.Body

  updateRole(delta: number, node: DataNode): void {
    // sync x and y with node
    this.node.data('x', this.body.position.x);
    this.node.data('y', this.body.position.y);
    this.node.data('interpolate', true);
  }
}

export class MatterCircleBody extends PhysicsRole {


  get radius() {
    return this.node.data('radius');
  }

  get name() {
    return 'MatterCircleBody';
  }

  // TODO if radius set -> update matter circle object

  constructor() {
    super();
  }

  createBody(x: number, y: number, engine: Matter.Engine): Matter.Body {
    return Matter.Bodies.circle(x, y, this.radius, { restitution: 1, friction: 1});
  }

}

/**
 * Moves body to right and left.
 * Depends on PhysicsRole.
 */
export class ShakyRole implements Role {
  node: DataNode;
  id: string;

  leftRight: boolean = false;

  get name() {
    return 'ShakyRole';
  }

  updateRole(delta: number, node: DataNode): void {
    let physicsRole: PhysicsRole = node.getRoleByClass(PhysicsRole);
    if (physicsRole === undefined) {
      return;
    }

    if (this.leftRight) {
      Matter.Body.setVelocity(physicsRole.body, Matter.Vector.create(-1, 0));
    } else {
      Matter.Body.setVelocity(physicsRole.body, Matter.Vector.create(1, 0));
      //node.data('x', node.data('x') + 0.1 * delta);
    }
  }

  addedToNode(node: DataNode): void {
  }

  removedFromNode(node: DataNode): void {
  }


}
