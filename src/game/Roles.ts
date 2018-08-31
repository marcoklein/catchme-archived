/// <reference path="../../devDependencies/phaser.d.ts"/>

import * as Phaser from 'phaser';
import { GameObjects } from 'phaser';
import { Role, DataNode } from "../engine/Dataframework";

/**
 * Used to hold a Phaser Sprite that is used for rendering.
 */
export class Sprite implements Role {
  private initX: number;
  private initY: number;


  id: string;
  name: string = 'Sprite';

  node: DataNode;


  private _sprite: GameObjects.Sprite;


  constructor(initX?: number, initY?: number) {
    this.initX = initX;
    this.initY = initY;
  }

  get sprite(): GameObjects.Sprite {
    return this._sprite;
  }

  set sprite(sprite: GameObjects.Sprite) {
    this.sprite = sprite;
    // move sprite to initial location
    if (this.initX !== undefined && this.initY !== undefined) {
      this.sprite.x = this.initX;
      this.sprite.y = this.initY;
    }
    this.syncWithNode(this.node);
  }

  private syncWithNode(node: DataNode) {
    if (this.sprite === undefined) return;
    // sync location with parent node
    node.data.set('x', this.sprite.x);
    node.data.set('y', this.sprite.y);
  }

  addedToNode(node: DataNode): void {
    this.syncWithNode(node);
  }

  removedFromNode(node: DataNode): void {
  }

  updateRole(delta: number, node: DataNode): void {
    this.syncWithNode(node);
  }

}
