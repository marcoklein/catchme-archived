import { DataNode, Role } from "../engine/Dataframework";
import * as Matter from 'matter-js'

export abstract class MatterRole implements Role {

  id: string;
  node: DataNode;
  name: string;

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

  constructor(x: number, y: number) {
    super();
    this.x = x;
    this.y = y;
  }

}

export class MatterCircleBody extends MatterBodyRole {

  private _radius: number;
  private body: Matter.Body;

  get radius() {
    return this._radius;
  }

  // TODO if radius set -> update matter circle object

  constructor(x: number, y: number, radius: number) {
    super(x, y);
    this._radius = radius;
  }

  engineUpdated(engine: Matter.Engine, oldEngine: Matter.Engine): void {
    this.body = Matter.Bodies.circle(this.x, this.y, this.radius);
    Matter.World.add(engine.world, this.body);
    console.log('circle body added to matter engine');
  }


}
