import { EntityProducer } from "../engine/EntityFactory";
import { Role, DataNode } from "../engine/Dataframework";
import * as Roles from "../game/Roles";
import * as ClientRoles from "./ClientRoles";


export class PlayerProducer implements EntityProducer {
  produceEntity(type: string, data: any): DataNode {
    let node = new DataNode();

    node.addRole(new ClientRoles.PlayerControl());
    node.addRole(new Roles.SpriteRole(data.x, data.y, data.image));

    return node;
  }
}
