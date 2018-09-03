import { GameMode, ServerGameInterface } from "../server/ServerMain";
import { PlayerEntity } from "../server/Entities";


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

  playerJoined(player: PlayerEntity): void {
    console.log('player joined!');
  }

  playerLeft(player: PlayerEntity): void {
    console.log('player left!');
  }



}
