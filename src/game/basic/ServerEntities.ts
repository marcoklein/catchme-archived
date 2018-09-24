import { DataNode, Role, AbstractRole } from "../../engine/Dataframework";
import { PhysicsRole, MatterCircleBody } from "../../server/PhysicsRoles";


/**
 * An Entity is a decorator class solely used on the server side.
 * Entities help game developers to know what kind of data is stored with particular nodes.
 *
 * If a new Entity is added on the server an according ClientEntityProducer has to be added to the client!
 */
export abstract class EntityRole extends AbstractRole {

	node: DataNode;


	get roleName() {
		return 'Entity';
	}

  constructor() {
		super();
		let node = new DataNode();
		node.addRole(this);
  }

	addedToNode(node: DataNode) {
		super.addedToNode(node);
		// initialize
		this.type = this.getType();
	}

	removedFromNode(node: DataNode) {
		super.removedFromNode(node);
	}

	abstract getType(): string;

  set type(type) {
    this.data('type', type);
  }

  get type() {
    return this.data('type');
  }

	set entityId(id) {
		this.data('id', id);
	}

  get entityId() {
		if (this.node) {
			return this.data('id');
		} else {
			return undefined;
		}
  }

}

export abstract class PhysicsEntity extends EntityRole {


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

/**
 * A player can be a hunter or not.
 */
export class PlayerRole extends PhysicsEntity {
  static TYPE: string = 'player';
  private _physicsRole: PhysicsRole;

  constructor() {
    super();
  }

	getType() {
		return 'Player';
	}


	addedToNode(node: DataNode) {
		super.addedToNode(node);
		// initialize
    this.name = this.name || '<unnamed>';
    this._physicsRole = new MatterCircleBody();
    this.node.addRole(this._physicsRole);
	}

	removedFromNode(node: DataNode) {
		super.removedFromNode(node);
		// cleanup
		this.node.removeRole(this._physicsRole);
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

	set isHunter(isHunter: boolean) {
		this.data('isHunter', isHunter);
	}

	get isHunter() {
		return this.data('isHunter');
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

}
