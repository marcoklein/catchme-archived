import { DataNode } from "../engine/Dataframework";


export interface ClientEntityProducer {
  type: string;
  produceClientEntity(node: DataNode): DataNode;
}

/**
 * Factory to produce Entities for the world. Entities have a certain 'type' and
 * consists out of several Roles that define behavior.
 *
 * Entity types can be registered through registerEntity(type, producer)
 * The produceFunction must return an Entity.
 */
export class ClientEntityFactory {

  // map of registereded entities associated to their type key
  private registeredProducers: any = {};

  /**
   * Produces and returns Entity with given type.
   * An EntityProducer has to be registered using registerEntity() in order to
   * produce an entity type.
   *
   * @param type Type of Entity to produce.
   */
  produceFromType(type: string, data?: Object): DataNode {
    let producer = this.registeredProducers[type];
    if (producer) {
      // create node, the producer can edit
      let node = new DataNode(data);
      return producer.produceClientEntity(node);
    }
    throw new Error('Unsupported Entity type of EntityFactory: ' + type);
  }

  /**
   * Register a new EntityProducer that can produce a certain type of Entity.
   *
   * @param type Type of producer.
   * @param producer Producer used to create Entity.
   */
  registerProducer(type: string, producer: ClientEntityProducer) {
    this.registeredProducers[type] = producer;
  }

  /**
   * Unregister producer with given type.
   *
   * @param type Type of EntityProducer to remove.
   */
  unregisterProducer(type: string) {
    delete this.registeredProducers[type];
  }
}
