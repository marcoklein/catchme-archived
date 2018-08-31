
/** Test Scene */
export class MainScene extends Phaser.Scene {
  private phaserSprite: Phaser.GameObjects.Sprite;

  constructor() {
    super({
      key: "MainScene"
    });
  }

  preload(): void {
    //this.load.image("logo", "./assets/boilerplate/phaser.png");
    this.load.image('test-sprite', 'assets/images/sprite.png');
  }

  create(): void {
    //this.phaserSprite = this.add.sprite(400, 300, "logo");
    //var sprite = this.add.sprite(400, 300, 'test-sprite');

    /*var text = "super text";
    var style = { font: "16px Arial", fill: "#00ff44", align: "center" };

    var t = this.add.text(300, 0, text, style);*/
  }
}
