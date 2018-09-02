import { DataNode } from './Dataframework';


export interface WorldUpdateData {
  worldChanges: {
    addedEntities: {[entityId: string]: {[key: string]: any}},
    removedEntitites: {[entityId: string]: {[key: string]: any}}
  };
  entityChanges: {
    updatedData:  {[entityId: string]: { key: string, value: any }}
  };
}

/**
 * Basic message sent using the NetworkController.
 */
export interface Message {
  type: string;
  data: any;
}

export interface MessageHandler {
  apply(data: any, controller: NetworkController): void;
}

/**
 */
export abstract class NetworkController {
  private messageHandlers: any = {};
  private messages: any = {};


  constructor() {
  }

  registerMessage(type: string, message: any) {
    console.log('Network: registered new message with type "' + type + '"');
    this.messages[type] = message;
  }

  registerMessageHandler(name: string, handler: MessageHandler) {
    console.log('Network: registered new message handler with name "' + name + '"');
    this.messageHandlers[name] = handler;
  }

  handleMessage(eventData: Message) {
    let type = eventData.type;
    let data = eventData.data;

    let message = this.messages[type];
    message.apply(data, this);

    /*let handler = this.messageHandlers[name];
    if (handler) {*/
      /*if (type.match(new RegExp('^' + WorldMessages.WORLD_MESSAGE_PREFIX, 'i'))) {
        // world message
        handler.apply(data, this.world);
      } else {
        handler.apply(data, this);
      }*/
      /*handler.apply(data, this);
    } else {
      console.warn('Network: could not handle message "' + name + '". Specify a handler using registerHandler().');
    }*/
  }

}
