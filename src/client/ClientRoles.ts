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
 */
export class SpriteRole extends PhaserRole {
  scene: Phaser.Scene;
  private initX: number;
  private initY: number;
  private initImage: string;


  id: string;
  name: string = 'Sprite';

  node: DataNode;


  private _sprite: GameObjects.Sprite;


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
  }

  changedPhaserScene(scene: Phaser.Scene, oldScene?: Phaser.Scene): void {
    console.log('Changed phaser scene: adding');
    this._sprite = this._scene.add.sprite(this.node.data('x'), this.node.data('y'), this.node.data('image'));
  }

  addedToNode(node: DataNode): void {
    // TODO set data of node (initx, inity, image);
    this.syncWithNode(node);
  }

  removedFromNode(node: DataNode): void {
  }

  lastPositionUpdate: number = 0;
  destPos: Phaser.Math.Vector2 = new Phaser.Math.Vector2();
  srcPos: Phaser.Math.Vector2 = new Phaser.Math.Vector2();
  updateRole(delta: number, node: DataNode): void {
    if (this._sprite) {
      // test if position has changed
      let x = this.node.data('x');
      let y = this.node.data('y');
      if (this._sprite.x !== x || this._sprite.y !== y) {
        // position changed
        // should interpolation be used?
        if (!this.node.data('posSet')) {
          // move entity to node position
          // use interpolation if delta la
          //this.srcPos.set(this._sprite.x, this._sprite.y);
          //this.destPos.set(x, y);
          this._sprite.x = node.data('x');
          this._sprite.y = node.data('y');
        } else {
          // set position
          this._sprite.x = node.data('x');
          this._sprite.y = node.data('y');
        }
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
    this.upKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.leftKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.downKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.rightKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  }

  updateRole(delta: number, node: DataNode): void {
    let moveDirection = new Phaser.Math.Vector2(0, 0);
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
    }

  }

  removedFromNode(node: DataNode): void {
  }

  addedToNode(node: DataNode): void {
  }

}
