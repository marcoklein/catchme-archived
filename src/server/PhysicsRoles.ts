import { DataNode, Role, AbstractRole } from "../engine/Dataframework";
import * as Matter from 'matter-js'

/* Util Roles */
/**
 * Removes itself after a certain amount of time.
 */
export abstract class TimedRole extends AbstractRole {

	remainingTime: number;
	totalTime: number;

	constructor(totalTime?: number) {
    super();
		this.totalTime = totalTime;
	}

	addedToNode(node: DataNode) {
		this.remainingTime = this.totalTime;
	}

	updateRole(delta: number, node: DataNode) {
		if (this.remainingTime <= 0) {
			// destroy data node
			this.node.removeRole(this); // TODO add Role.removeFromParent()
		}
		this.remainingTime -= delta;
	}

}

/* Physics Roles */
export abstract class MatterRole implements Role {

  id: string;
  node: DataNode;

  abstract get roleName(): string;

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

  private oldMoveDirection = Matter.Vector.create(0, 0);
  moveDirection: Matter.Vector = Matter.Vector.create(0, 0);

  constructor() {
    super();
  }

  get x() {
    return this.node.data('x');
  }

  get y() {
    return this.node.data('y');
  }

  get speed() {
    return this.node.data('speed');
  }

  set speed(speed) {
    this.node.data('speed', speed);
  }


  engineUpdated(engine: Matter.Engine, oldEngine: Matter.Engine): void {
		if (!engine && oldEngine) {
			// setting engine to null -> remove body
			Matter.World.remove(oldEngine.world, this.body);
		} else if (engine) {
	    console.log('updating engine');
	    this.body = this.createBody(this.x, this.y, engine);
			this.body.label = this.node.data('id');
	    Matter.World.add(engine.world, this.body);
	    // set initial position
	    this.node.data('x', this.x);
	    this.node.data('y', this.y);
	    // set default val
	    this.speed = this.speed || 1;
	    console.log('physics body created');
		}
  }

  abstract createBody(x: number, y: number, engine: Matter.Engine): Matter.Body

  updateRole(delta: number, node: DataNode): void {
    // sync x and y with node
    this.node.data('x', this.body.position.x);
    this.node.data('y', this.body.position.y);
    this.node.data('interpolate', true);

    // move entity body (do not modify velocity)
    Matter.Body.translate(this.body, this.moveDirection);
  }

  setMoveDirection(x: number, y: number) {
    this.moveDirection.x = x;
    this.moveDirection.y = y;
    // init vector
    this.moveDirection = Matter.Vector.normalise(this.moveDirection);
    // scale with speed
    this.moveDirection.x *= this.speed;
    this.moveDirection.y *= this.speed;
  }
}

export class MatterCircleBody extends PhysicsRole {


  get radius() {
    return this.node.data('radius');
  }

  get roleName() {
    return 'MatterCircleBody';
  }

  // TODO if radius set -> update matter circle object

  constructor() {
    super();
  }

  createBody(x: number, y: number, engine: Matter.Engine): Matter.Body {
    return Matter.Bodies.circle(x, y, this.radius, { restitution: 0.1, friction: 0.05});
  }

}

/**
 * Moves body to right and left.
 * Depends on PhysicsRole.
 */
export class ShakyRole implements Role {
  node: DataNode;
  id: string;

  leftRight: boolean = true;
  moveTime: number = 0;
  maxMoveTime: number = 2000;

  get roleName() {
    return 'ShakyRole';
  }

  updateRole(delta: number, node: DataNode): void {
    let physicsRole: PhysicsRole = node.getRoleByClass(PhysicsRole);
    if (physicsRole === undefined) {
      return;
    }
    this.moveTime -= delta;
    if (this.moveTime <= 0) {
      this.moveTime = this.maxMoveTime;
      this.leftRight = !this.leftRight;

      // only set velocity once for a change
      if (this.leftRight) {
        Matter.Body.setVelocity(physicsRole.body, Matter.Vector.create(-1, 0));
      } else {
        Matter.Body.setVelocity(physicsRole.body, Matter.Vector.create(1, 0));
      }
    }


  }

  addedToNode(node: DataNode): void {
  }

  removedFromNode(node: DataNode): void {
  }


}
