
import { EntityProducer } from '../engine/EntityFactory'
import { DataNode } from '../engine/Dataframework';
import { MatterCircleBody, ShakyRole } from './ServerRoles';
import Matter = require('matter-js');

export class PlayerProducer implements EntityProducer {

  produceEntity(type: string, data: any): DataNode {
    // validate data object
    data = data || {};
    data.type = type;
    data.image = data.image || 'characterBlue';

    let node = new DataNode(data);
    //node.data('type', type);

    node.addRole(new MatterCircleBody(Math.random() * 100, 200, 20));
    node.addRole(new ShakyRole());

    return node;
  }

}
