import { DataNode, Role } from "../engine/Dataframework";
import { PhysicsRole, MatterCircleBody, ShakyRole } from "../server/ServerRoles";


/**
 * An Entity is a decorator class solely used on the server side.
 * Entities help game developers to know what kind of data is stored with particular nodes.
 *
 * If a new Entity is added on the server an according ClientEntityProducer has to be added to the client!
 */
export abstract class ServerEntities extends DataNode {

  constructor(type: string) {
    super();
    this.type = type;
  }

  set type(type) {
    this.data('type', type);
  }

  get type() {
    return this.data('type');
  }

  get id() {
    return this.data('id');
  }

}

export abstract class PhysicsEntity extends ServerEntities {


  set x(x) {
    this.data('x', x);
  }

  set y(y) {
    this.data('y', y);
  }

  get x() {
    return this.data('x');
  }

  get y() {
    return this.data('y');
  }
}

export class PlayerEntity extends PhysicsEntity {
  static TYPE: string = 'player';
  private _physicsRole: PhysicsRole;

  constructor() {
    super('player');

    this.name = this.name || '<unnamed>';

    this._physicsRole = new MatterCircleBody();
    this.addRole(this._physicsRole);
    //this.addRole(new ShakyRole());
  }

  set name(name) {
    this.data('name', name);
  }

  get name() {
    return this.data('name');
  }

  set texture(texture) {
    this.data('texture', texture);
  }

  get texture() {
    return this.data('texture');
  }

  set radius(radius) {
    this.data('radius', radius);
  }

  get radius() {
    return this.data('radius');
  }

  get speed() {
    return this.data('speed');
  }

  set speed(speed) {
    this.data('speed', speed);
  }

  setMoveDirection(x: number, y: number) {
    this._physicsRole.setMoveDirection(x, y);
  }

  /*
  set asdf(asdf) {
    this.data('asdf', asdf);
  }

  get asdf() {
    return this.data('asdf');
  }*/

}
