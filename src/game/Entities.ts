import { DataNode, Role } from "../engine/Dataframework";
import { PhysicsRole, MatterCircleBody, ShakyRole } from "../server/ServerRoles";


/**
 * An Entity is a decorator class solely used on the server side.
 * Entities help game developers to know what kind of data is stored with particular nodes.
 *
 * If a new Entity is added on the server an according ClientEntityProducer has to be added to the client!
 */
export abstract class Entity extends DataNode {

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

export abstract class PhysicsEntity extends Entity {
  private _physicsRole: PhysicsRole;


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

  constructor() {
    super('player');

    this.name = this.name || '<unnamed>';

    this.addRole(new MatterCircleBody());
    //this.addRole(new ShakyRole());
  }

  set name(name) {
    this.data('name', name);
  }

  get name() {
    return this.data('name');
  }

  set image(image) {
    this.data('image', image);
  }

  get image() {
    return this.data('image');
  }

  set radius(radius) {
    this.data('radius', radius);
  }

  get radius() {
    return this.data('radius');
  }

  /*
  set asdf(asdf) {
    this.data('asdf', asdf);
  }

  get asdf() {
    return this.data('asdf');
  }*/

}
