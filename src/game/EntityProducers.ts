import { EntityProducer } from "../engine/EntityFactory";
import { Role, DataNode } from "../engine/Dataframework";
import * as Roles from "./Roles";


class SimpleSpriteProducer implements EntityProducer {
  produceEntity(type: string): DataNode {
    let node = new DataNode();

    node.addRole(new Roles.Sprite());

    return node;
  }

}
