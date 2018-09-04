import { GameMode, ServerGameInterface } from "../server/ServerMain";
import { PlayerEntity, Entity } from "./Entities";
import { HostedConnection } from "../server/ServerNetworkController";
import { MatterRole } from "../server/ServerRoles";


export class SimpleCatchme implements GameMode {

  protected game: ServerGameInterface;

  initGame(game: ServerGameInterface): void {
    this.game = game;
  }

  startGame(game: ServerGameInterface): void {
  }

  update(delta: number): void {
  }

  finishGame(): void {
  }

  clientJoined(client: HostedConnection): void {
    console.log('client joined!');

    // send new player
    let player = new PlayerEntity();
    player.name = 'test';
    player.x = Math.random() * 100;
    player.y = 300;
    player.radius = 30;
    player.image = 'characterBlue';

    this.game.world.addEntity(player);

    // TODO tell client, that he can control this entity
    // (use client.setEntityId()?)
  }

  clientLeft(client: HostedConnection): void {
    console.log('player left!');
  }




}
