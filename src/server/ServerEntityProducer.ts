
import { EntityProducer } from '../engine/EntityFactory'
import { DataNode } from '../engine/Dataframework';
import { MatterCircleBody } from './ServerRoles';

export class PlayerProducer implements EntityProducer {

  produceEntity(type: string, data: Object): DataNode {
    let node = new DataNode(data);
    //node.data('type', type);

    node.addRole(new MatterCircleBody(10, 10, 40));

    return node;
  }

}
