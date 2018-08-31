
/**
 * Dataframework is a tiny library to separate data and logic easily.
 * Data is held in Nodes. Nodes can contain other Nodes in form of childs.
 * Node logic is defined by adding Roles. Each role needs a unique name for identification.
 */
namespace Dataframework {


  /**
   * Defines logic for a Node.
   * For identification every role needs a unique name
   * that has to be set in the constructor.
   */
  interface Role {
    readonly name: string;
    node: Node;
    id: string;

    addedToNode(parent: Node): void;
    removedFromNode(parent: Node): void;
    update(delta: number, parent: Node): void;
  }

  interface DataListener {
    dataUpdated(key: string, newValue: any, oldValue: any): void;
    dataDeleted(key: string): void;
  }

  /**
   * Manages adding, updating and deleting of data.
   * A data listener can be attached to be informed about data updates.
   */
  class Data {
    private data: any;

    private listeners: Array<DataListener> = [];

    get(key?: string) {
      if (key === undefined) {
        return this.data;
      }
      return this.data[key];
    }
    set(key: string, value: any) {
      let oldValue = this.data[key];
      this.data[key] = value;
      this.listeners.forEach(listener => {
        listener.dataUpdated(key, value, oldValue);
      });
    }
    /**
     * Delete data with given key.
     */
    delete(key: string) {
      delete this.data[key];
      this.listeners.forEach(listener => {
        listener.dataDeleted(key);
      });
    }

    /* Listeners */

    addListener(listener: DataListener): void {
      this.listeners.push(listener);
    }
    removeListener(listener: DataListener): void {
      this.listeners.splice(this.listeners.indexOf(listener), 1);
    }
  }

  /**
   * Listener gets informed about Node events.
   */
  interface NodeListener {
    addedRoleToNode(role: Role, node: Node): void;
  }

  /**
   * Holds data and may contain further Node childs.
   * Roles can be added to Nodes.
   */
  export class Node {
    readonly data: Data;

    private listeners: Array<NodeListener> = [];
    private roles: any = {};
    private rolesByName: any = {};
    private roleArray: Array<Role> = [];

    private lastRoleId = 0;


    /* Listeners */
    addListener(listener: NodeListener): void {
      this.listeners.push(listener);
    }
    /*removeListener(listener: NodeListener): void {
      this.listeners.splice(this.listeners.indexOf(listener), 1);
    }*/

    /*private notifyListeners<T extends keyof NodeListener>(fnName: T, a: any, b: any) {
      this.listeners.forEach(listener => {
        if (listener[fnName]) {
          listener[fnName].call(a, b);
        }
      });
    }*/

    /* Roles */

    /**
     * Returns Role with given id.
     * @param id Id of Role to return.
     * @return Role with given id or undefined.
     */
    getRoleById(id: string): Role {
      return this.roles[id];
    }
    getRoleByName(name: string): Role {
      let roles = this.rolesByName[name];
      if (!roles || roles.length === 0) {
        return null;
      }
      return roles[0];
    }
    getRolesByName(name: string): Array<Role> {
      return this.rolesByName[name];
    }

    /**
     * Add given role.
     * The role must have a name property.
     * The name property is copied to role.data.name and must not be modified.
     *
     *
     *
     * @param role Role to add.
     */
    addRole(role: Role) {
      let name = role.name;
      if (name === undefined || name === null || name.trim() === '') {
        throw new Error('Role has no name.');
      }
      if (role.node !== undefined) {
        throw new Error('Tried to add role ' + name + ', but role is already attached to a node.');
      }

      // generate id for role
      let roleId = role.id || this.generateNewRoleId();
      role.id = roleId;

      // store role instance
      this.roles[roleId] = role;
      this.roleArray.push(role);

      // name array of role exists?
      let nameRoleArray = this.rolesByName[role.name];
      if (nameRoleArray !== undefined) {
        nameRoleArray.push(role);
      } else {
        this.rolesByName[role.name] = [role];
      }

      // store node in role
      role.node = this;
      // notify role
      role.addedToNode(this);

      // notify listeners
      this.listeners.forEach(listener => {
        listener.addedRoleToNode(role, this);
      });

      return roleId;
    }

    /**
     * Removes given role from Node.
     * @param role Role instance to remove.
     */
    removeRole(role: Role) {
      if (role.node === undefined || role.node === null) {
        return;
      }
      // unset role node and id
      role.node = undefined;
      role.id = undefined;

      // remove from node

      throw new Error('Not implemented yet.');
    }

    /**
     * Generates a new unique id for a Role that is added to the Node.
     */
    private generateNewRoleId(): string {
      this.lastRoleId++;
      if (this.roles.lastId !== 'undefined') {
        // node with id already existing -> generate new id
        return this.generateNewRoleId();
      }
      return '' + this.lastRoleId;
    }

  }

}
