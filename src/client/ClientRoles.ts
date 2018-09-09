/// <reference path="../../devDependencies/phaser.d.ts"/>

import * as Phaser from 'phaser';
import { GameObjects } from 'phaser';
import { Role, DataNode } from '../engine/Dataframework';


export abstract class PhaserRole implements Role {

  id: string;
  node: DataNode;
  name: string;

  protected _scene: Phaser.Scene;

  get scene() {
    return this._scene;
  }

  set scene(scene: Phaser.Scene) {
    let oldScene = this._scene;
    this._scene = scene;
    this.changedPhaserScene(scene, oldScene);
  }

  abstract changedPhaserScene(scene: Phaser.Scene, oldScene?: Phaser.Scene): void;

  updateRole(delta: number, node: DataNode): void {
  }
  removedFromNode(node: DataNode): void {
  }
  addedToNode(node: DataNode): void {
  }

}

/**
 * Used to hold a Phaser Sprite that is used for rendering.
 * TODO create separate roles for PhaserGame Object (that has a position) and particles and sprites..
 */
export class SpriteRole extends PhaserRole {
  scene: Phaser.Scene;
  private initX: number;
  private initY: number;
  private initImage: string;

  width: number;
  height: number;


  id: string;
  name: string = 'Sprite';

  node: DataNode;


  private _sprite: GameObjects.Sprite;
	private _particles: GameObjects.Particles.ParticleEmitterManager;
	private _emitter: GameObjects.Particles.ParticleEmitter;


  constructor(initX?: number, initY?: number, initImage?: string) {
    super();
    this.initX = initX;
    this.initY = initY;
    this.initImage = initImage;
  }

  get sprite(): GameObjects.Sprite {
    return this._sprite;
  }

  set sprite(sprite: GameObjects.Sprite) {
    this._sprite = sprite;
    // move sprite to initial location
    if (this.initX !== undefined && this.initY !== undefined) {
      this._sprite.x = this.initX;
      this._sprite.y = this.initY;
    }
    if (this.initImage) {
      //this._sprite.setTexture(this.initImage);
    }
    this.syncWithNode(this.node);
  }

  private syncWithNode(node: DataNode) {
    if (this._sprite === undefined) return;
    // sync location with parent node
    node.data('x', this.sprite.x);
    node.data('y', this.sprite.y);
    this.destX = this.sprite.x;
    this.destY = this.sprite.y;
  }

	nodeDataUpdated(key: string, value: any, oldValue: any, node: DataNode) {
		// update sprite texture if image changed
		if (key === 'texture') {
			this.changeSprite();
		}
		if (key === 'particles') {
			this.changeParticleEffect();
		}
	}

	/**
	 * Changes this sprite texture by first recreating the sprite (destroy and create).
	 */
	private changeSprite() {
		if (this._sprite) {
			// remove sprite first
			this._sprite.destroy();
		}
    this._sprite = this._scene.add.sprite(this.node.data('x'), this.node.data('y'), this.node.data('texture'));
    if (this._sprite.width && this._sprite.height) {
      this._sprite.setDisplaySize(this.width, this.height);
    }

    this.destX = this.node.data('x');
    this.destY = this.node.data('y');
	}

	private changeParticleEffect() {
		if (this._particles) {
			// remove particle manager first
			this._particles.destroy();
		}
		// if particles are defined, create them
		let particles = this.node.data('particles');
		if (particles) {
			this._particles = this._scene.add.particles(particles);
			this._emitter = this._particles.createEmitter({});
			this._emitter.setPosition(this.destX, this.destY);
			this._emitter.setSpeed(200);
			this._emitter.setLifespan(200);
			this._emitter.setBlendMode(Phaser.BlendModes.ADD);
		}
	}

  changedPhaserScene(scene: Phaser.Scene, oldScene?: Phaser.Scene): void {
    console.log('Changed phaser scene: adding');
		this.changeSprite();
		this.changeParticleEffect();
  }

  addedToNode(node: DataNode): void {
    // TODO set data of node (initx, inity, image);
    this.syncWithNode(node);
    if (this._sprite) {
      this._sprite.x = this.node.data('x');
      this._sprite.y = this.node.data('y');
    }
  }

  removedFromNode(node: DataNode): void {
  }

  private interpolating: boolean = false;
  // for how many ms interpolation is already running
  private updateTime: number = 0;
  // number of ms the interpolation needs (set to server default)
  private interpolationDelta: number = 50;
  private destPos: Phaser.Math.Vector2 = new Phaser.Math.Vector2();
  private srcPos: Phaser.Math.Vector2 = new Phaser.Math.Vector2();

  // store positions before interpolation to detect position changes
  private destX: number;
  private destY: number;

  private startPos: Phaser.Math.Vector2 = new Phaser.Math.Vector2();


  doInterpolation(delta: number) {
    // move entity to node position
    let interpolationProgress: number;
    //console.log('this update time before %s', this.updateTime);
    //console.log('interpolation time: %s, delta: %s', this.updateTime, delta);
    if (this.updateTime > this.interpolationDelta) {
      this.updateTime = this.interpolationDelta;
      interpolationProgress = 1;
      this.interpolating = false;
    } else {
      interpolationProgress = this.updateTime / this.interpolationDelta;
      //console.log('interpolation progress: %s', interpolationProgress);
    }
    this.srcPos.copy(this.startPos);
    //this.destPos.set(this.destX, this.destY);
    //console.log('from (%s,%s) to (%s,%s)', this.srcPos.x, this.srcPos.y, this.destPos.x, this.destPos.y);
    //this.destPos.subtract(this.srcPos).scale(interpolationProgress).add(this.srcPos);
    this.srcPos.lerp(this.destPos, interpolationProgress);
    //console.log('after(%s,%s)', this.destPos.x, this.destPos.y);

    //console.log('diff: %s', (this.destPos.x - this.srcPos.x));
    //console.log('inte: %s', ((this.destPos.x - this.srcPos.x) * interpolationProgress));
    //this.srcPos.x = (this.destPos.x - this.srcPos.x) * interpolationProgress + this.srcPos.x;
    //this.srcPos.x = this.srcPos.x * interpolationProgress + this.destPos.x * (1 - interpolationProgress);
    //console.log('x interpol: %s, %s', this.srcPos.x, 1 - interpolationProgress);

    // move sprite to calculated position
    this._sprite.x = this.srcPos.x;
    this._sprite.y = this.srcPos.y;
    this.updateTime += delta;
  }


  updateRole(delta: number, node: DataNode): void {
		if (this._emitter) {
			this._emitter.setPosition(this.node.data('x'), this.node.data('y'));
		}
    if (this._sprite) {
      // test if node position has changed
      if (this.destX !== this.node.data('x') || this.destY !== this.node.data('y')) {
        // TODO set start position of sprite hard if it moved too far away..
        //this.startPos.set(this.destX, this.destY);
        this.startPos.set(this._sprite.x, this._sprite.y);

        this.destX = this.node.data('x');
        this.destY = this.node.data('y');
        // position changed
        // should interpolation be used?
        if (this.node.data('interpolate') == true) {
          this.interpolating = true;
          // start new interpolation
          this.updateTime = 0;
          this.destPos.set(this.destX, this.destY);
          this.srcPos.set(this._sprite.x, this._sprite.y);
          this.doInterpolation(delta);
        } else {
          this.interpolating = false;
          // set position without interpolation
          this._sprite.x = this.node.data('x');
          this._sprite.y = this.node.data('y');
          this.syncWithNode(node);
        }
      } else if (this.interpolating === true) {
        // update ongoing interpolation
        this.doInterpolation(delta);
      }
    }
  }

}

export class PlayerControl extends PhaserRole {

  id: string;
  node: DataNode;
  name: string = 'Player';

  upKey: Phaser.Input.Keyboard.Key;
  leftKey: Phaser.Input.Keyboard.Key;
  downKey: Phaser.Input.Keyboard.Key;
  rightKey: Phaser.Input.Keyboard.Key;

  moveDirection: Phaser.Math.Vector2 = new Phaser.Math.Vector2();

  changedPhaserScene(scene: Phaser.Scene, oldScene?: Phaser.Scene) {
    /*this.upKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.leftKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.downKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.rightKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);*/
  }

  updateRole(delta: number, node: DataNode): void {
    /*let moveDirection = new Phaser.Math.Vector2(0, 0);
    // calculate move direction
    if (this.upKey.isDown) {
      moveDirection.y -= 1;
    }
    if (this.leftKey.isDown) {
      moveDirection.x -= 1;
    }
    if (this.downKey.isDown) {
      moveDirection.y += 1;
    }
    if (this.rightKey.isDown) {
      moveDirection.x += 1;
    }*/

  }

  removedFromNode(node: DataNode): void {
  }

  addedToNode(node: DataNode): void {
  }

}
