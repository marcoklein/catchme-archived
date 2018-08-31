
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
  }

  create(): void {
    //this.phaserSprite = this.add.sprite(400, 300, "logo");

    var text = "- phaser -\n with a sprinkle of \n pixi dust.";
    var style = { font: "65px Arial", fill: "#ff0044", align: "center" };

    var t = this.add.text(300, 0, text, style);
  }
}
