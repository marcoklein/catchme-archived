import { ClientEntityProducer } from "../client/ClientEntityFactory";
import { DataNode } from "../engine/Dataframework";
import * as ClientRoles from '../client/ClientRoles';


export const CLIENT_ENTITY_PRODUCERS: ClientEntityProducer[] = [
  {
    type: 'player',
    produceClientEntity(node: DataNode): DataNode {
      let data = node.data();
      node.addRole(new ClientRoles.PlayerControl());
      let spriteRole = new ClientRoles.SpriteRole();
      spriteRole.width = data.radius * 2;
      spriteRole.height = data.radius * 2;
      node.addRole(spriteRole);

      return node;
    }
  }
];
