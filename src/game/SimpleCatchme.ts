import { GameMode, ServerGameInterface, GameHelper } from "../server/ServerMain";
import { PlayerEntity, Entity } from "./Entities";
import { HostedConnection } from "../server/ServerNetworkController";
import { UserActions } from "../engine/Network";
import { PhysicsRole } from "../server/ServerRoles";


export class SimpleCatchme implements GameMode {

  protected game: ServerGameInterface;
  protected helper: GameHelper;

  protected players: {[id: string]: PlayerEntity};

  startGame(game: ServerGameInterface): void {
    this.game = game;
    this.helper = new GameHelper(game);

    this.helper.createWorldBoundaries(0, 0, 800, 600);
  }

  update(delta: number): void {
  }

  finishGame(): void {
  }

  userActions(client: HostedConnection, actions: UserActions) {
    // apply move direction
    if (actions.mX !== undefined && actions.mY !== undefined) {
      let player = (<PlayerEntity>this.game.world.getEntityById(client.entityId));
      player.setMoveDirection(actions.mX, actions.mY);
    }
  }

  clientJoined(client: HostedConnection): void {
    console.log('client joined the dark side!');

    // send new player
    let player = new PlayerEntity();
    player.name = client.name;
    player.x = Math.random() * 100;
    player.y = 300;
    player.radius = 30;
    player.speed = 5;
    player.image = 'characterBlue';

    this.game.world.addEntity(player);

    client.entityId = player.id;

    // TODO tell client, that he can control this entity
    // (use client.setEntityId()?)
  }

  clientLeft(client: HostedConnection): void {
    console.log('player rage quit!');
  }




}
