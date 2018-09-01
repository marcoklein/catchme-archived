/// <reference path="../../devDependencies/phaser.d.ts"/>

import * as Phaser from 'phaser';
import { GameObjects } from 'phaser';
import { Role, DataNode } from '../engine/Dataframework';
import { PhaserRole } from '../game/Roles';


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
