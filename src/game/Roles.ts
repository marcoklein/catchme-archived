/// <reference path="../../devDependencies/phaser.d.ts"/>

import * as Phaser from 'phaser';
import { GameObjects } from 'phaser';
import { Role, DataNode } from "../engine/Dataframework";


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
    //this._sprite = this._scene.add.sprite(this.initX, this.initY, this.initImage);
  }

  addedToNode(node: DataNode): void {
    this.syncWithNode(node);
  }

  removedFromNode(node: DataNode): void {
  }

  updateRole(delta: number, node: DataNode): void {
    // move entity to node position
    if (this._sprite) {
      // TODO add data listener and listen to updates of x and y
      this._sprite.x = node.data('x');
      this._sprite.y = node.data('y');
    }
  }

}
