
import { EntityProducer } from '../engine/EntityFactory'
import { DataNode } from '../engine/Dataframework';
import { MatterCircleBody, ShakyRole } from './ServerRoles';

export class PlayerProducer implements EntityProducer {

  produceEntity(type: string, data: any): DataNode {
    // validate data object
    data = data || {};
    data.type = type;
    data.image = data.image || 'test-sprite';

    let node = new DataNode(data);
    //node.data('type', type);

    node.addRole(new MatterCircleBody(200, 200, 40));
    node.addRole(new ShakyRole());

    return node;
  }

}
