import { ClientEntityProducer } from "../../client/ClientEntityFactory";
import { DataNode } from "../../engine/Dataframework";
import * as ClientRoles from '../../client/PhaserRoles';


export const CLIENT_ENTITY_PRODUCERS: ClientEntityProducer[] = [
  {
    type: 'Player',
    produceClientEntity(node: DataNode): DataNode {
      let data = node.data();
      let spriteRole = new ClientRoles.SpriteRole();
      spriteRole.width = data.radius * 2;
      spriteRole.height = data.radius * 2;
      node.addRole(spriteRole);
			let updateHunterParticles = function(node: DataNode) {
				if (node.data('isHunter') === true) {
					node.data('particles', 'particle-catcher');
				} else {
					node.data('particles', null);
				}
			}
			node.addListener({
				dataUpdated(key: string, newValue: any, oldValue: any, node: DataNode) {
					if (key === 'isHunter') {
						updateHunterParticles(node);
					}
				}
			});
			// set hunter particles
			updateHunterParticles(node);


      return node;
    }
  }
];
