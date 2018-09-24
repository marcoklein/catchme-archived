import { GameMode, ServerGameInterface, GameHelper } from "../../server/ServerMain";
import { PlayerRole, EntityRole } from "./ServerEntities";
import { HostedConnection } from "../../server/ServerNetworkController";
import { UserActions } from "../../engine/Network";
import { DataNode } from "../../engine/Dataframework";
import { PhysicsRole } from "../../server/PhysicsRoles";
import Matter = require("matter-js");


export class TestGame implements GameMode {

  protected game: ServerGameInterface;
  protected helper: GameHelper;

  protected players: {[clientId: string]: PlayerRole} = {};

	protected somebodyIsHunter: boolean = false;

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
        let player: PlayerRole = this.players[key];
        // apply force to players every 2 seconds
        let body = (<PhysicsRole>player.node.getRoleByClass(PhysicsRole)).body;
        Matter.Body.applyForce(body, Matter.Vector.create(body.position.x, body.position.y), Matter.Vector.create(Math.random() * 0.1, Math.random() * 0.1));
      }
    }
  }

  finishGame(): void {
  }

  userActions(client: HostedConnection, actions: UserActions) {
    // apply move direction
    if (actions.mX !== undefined && actions.mY !== undefined) {
      let player: PlayerRole = this.game.world.getEntityById(client.entityId).getRoleByClass(PlayerRole);
      player.setMoveDirection(actions.mX, actions.mY);
    }
  }

  clientJoined(client: HostedConnection): void {
    console.log('client joined the dark side!');

    // send new player
    let player = new PlayerRole();
    player.name = client.name;
    player.x = Math.random() * 100;
    player.y = 300;
    player.radius = 30;
    player.speed = 5;
    player.texture = 'characterBlue';


    this.game.world.addEntity(player.node);

    client.entityId = player.entityId;

    this.players[client.id] = player;


		player.texture = 'characterBlue';

		if (!this.somebodyIsHunter) {
			this.somebodyIsHunter = true;
			player.isHunter = true;
		}

    // TODO tell client, that he can control this entity
    // (use client.setEntityId()?)
  }

  clientLeft(client: HostedConnection): void {
    console.log('player rage quit!');
  }

	collisionStart(entityA: DataNode, entityB: DataNode): void {
		let playerA: PlayerRole = entityA.getRoleByClass(PlayerRole);
		let playerB: PlayerRole = entityB.getRoleByClass(PlayerRole);
		// check only collision between two players
		if (playerA && playerB) {
			this.handlePlayerCollision(playerA, playerB);
		}

	}

	handlePlayerCollision(playerA: PlayerRole, playerB: PlayerRole) {
		if (playerA.isHunter && !playerB.isHunter) {
			playerB.isHunter = true;
			playerA.isHunter = false;
		} else if (!playerA.isHunter && playerB.isHunter) {
			playerB.isHunter = false;
			playerA.isHunter = true;
		}
	}



}
