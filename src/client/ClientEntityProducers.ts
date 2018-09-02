import { EntityProducer } from "../engine/EntityFactory";
import { Role, DataNode } from "../engine/Dataframework";
import * as ClientRoles from "./ClientRoles";


export class SimpleSpriteProducer implements EntityProducer {
  produceEntity(type: string, data: any): DataNode {
    let node = new DataNode(data);

    node.addRole(new ClientRoles.SpriteRole(data.x, data.y, data.image));

    return node;
  }

}

export class PlayerProducer implements EntityProducer {
  produceEntity(type: string, data: any): DataNode {
    let node = new DataNode(data);

    node.addRole(new ClientRoles.PlayerControl());
    let spriteRole = new ClientRoles.SpriteRole();
    spriteRole.width = data.radius / 2;
    spriteRole.height = data.radius / 2;
    node.addRole(spriteRole);


    return node;
  }
}
