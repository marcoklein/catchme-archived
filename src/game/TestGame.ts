import { GameMode, ServerGameInterface, GameHelper } from "../server/ServerMain";
import { PlayerEntity, Entity } from "./ServerEntities";
import { HostedConnection } from "../server/ServerNetworkController";
import { UserActions } from "../engine/Network";
import { DataNode } from "../engine/Dataframework";
import { PhysicsRole } from "../server/ServerRoles";
import Matter = require("matter-js");


export class TestGame implements GameMode {

  protected game: ServerGameInterface;
  protected helper: GameHelper;

  protected players: {[clientId: string]: PlayerEntity} = {};

	protected somebodyIsCatcher: boolean = false;

  startGame(game: ServerGameInterface): void {
    this.game = game;
    this.helper = new GameHelper(game);

    this.helper.createWorldBoundaries(0, 0, 800, 600);
  }

  forceTimer: number = 0;
  forceInterval: number = 10000;
  update(delta: number): void {
    this.forceTimer -= delta;
    if (this.forceTimer < 0) {
      this.forceTimer = this.forceInterval;
      console.log('applying force');
      for (let key in this.players) {
        let player: PlayerEntity = this.players[key];
        // apply force to players every 2 seconds
        let body = (<PhysicsRole>player.getRoleByClass(PhysicsRole)).body;
        Matter.Body.applyForce(body, Matter.Vector.create(body.position.x, body.position.y), Matter.Vector.create(Math.random() * 0.1, Math.random() * 0.1));
      }
    }
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
    player.texture = 'characterBlue';

    this.game.world.addEntity(player);

    client.entityId = player.id;

    this.players[client.id] = player;


		player.texture = 'characterBlue';

		if (!this.somebodyIsCatcher) {
			this.somebodyIsCatcher = true;
			player.particles = 'particle-catcher';
		}

    // TODO tell client, that he can control this entity
    // (use client.setEntityId()?)
  }

  clientLeft(client: HostedConnection): void {
    console.log('player rage quit!');
  }

	collisionStart(entityA: DataNode, entityB: DataNode): void {
		// for testing, there are only players
		if (entityA.data('particles')) {
			entityB.data('particles', entityA.data('particles'));
			entityA.data('particles', undefined);
		} else if (entityB.data('particles')) {
			entityA.data('particles', entityB.data('particles'));
			entityB.data('particles', undefined);
		}
	}



}
