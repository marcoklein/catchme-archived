import { Role, DataNode } from "../engine/Dataframework";

class Sprite implements Role {

  id: string;
  node: DataNode;

  name: string;

  addedToNode(parent: DataNode): void {
    throw new Error("Method not implemented.");
  }

  removedFromNode(parent: DataNode): void {
    throw new Error("Method not implemented.");
  }

  update(delta: number, parent: DataNode): void {
    throw new Error("Method not implemented.");
  }

}
