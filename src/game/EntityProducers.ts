import { EntityProducer } from "../engine/EntityFactory";
import { Role, DataNode } from "../engine/Dataframework";
import * as Roles from "./Roles";


export class SimpleSpriteProducer implements EntityProducer {
  produceEntity(type: string, data: any): DataNode {
    let node = new DataNode();

    node.addRole(new Roles.SpriteRole(data.x, data.y, data.image));

    return node;
  }

}
