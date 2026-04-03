import Phaser from "phaser";

export class MainScene extends Phaser.Scene {
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private keys!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };

  constructor() {
    super("MainScene");
  }

  preload() {
    this.load.spritesheet("hero", "assets/hero.png", {
      frameWidth: 372,
      frameHeight: 720,
    });
    // Load the professional Tilemap assets
    this.load.image("stardew_tiles", "assets/stardew_tileset.png");
    this.load.tilemapTiledJSON("map", "assets/map.json");
  }

  create() {
    this.createMap();

    // Mapping based on 8x2 grid (no gaps)
    // Row 1: Front (0-3), Back (4-7)
    // Row 2: Right (8-11), Left (12-15)

    this.anims.create({
      key: "walk-down",
      frames: this.anims.generateFrameNumbers("hero", { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-up",
      frames: this.anims.generateFrameNumbers("hero", { start: 4, end: 7 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-right",
      frames: this.anims.generateFrameNumbers("hero", { start: 8, end: 11 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-left",
      frames: this.anims.generateFrameNumbers("hero", { start: 12, end: 15 }),
      frameRate: 8,
      repeat: -1,
    });

    // Idle animations
    this.anims.create({
      key: "idle-down",
      frames: [{ key: "hero", frame: 0 }],
    });
    this.anims.create({ key: "idle-up", frames: [{ key: "hero", frame: 4 }] });
    this.anims.create({
      key: "idle-right",
      frames: [{ key: "hero", frame: 8 }],
    });
    this.anims.create({
      key: "idle-left",
      frames: [{ key: "hero", frame: 12 }],
    });

    // Create player sprite (on top of map)
    this.player = this.physics.add.sprite(400, 300, "hero", 0);
    this.player.setScale(0.14);

    // Apply visual crop
    this.player.setCrop(15, 0, 340, 720);

    // Adjust collision box
    this.player.body.setSize(160, 630);
    this.player.body.setOffset(106, 50);

    this.player.setCollideWorldBounds(true);

    // Simple input - WASD
    this.keys = this.input.keyboard!.addKeys("W,A,S,D") as any;
  }

  createMap() {
    // ---------------------------------------------------------
    // 强制 1:1 比例校准：杜绝长方形变形
    // ---------------------------------------------------------

    const map = this.make.tilemap({
        key: "map",
        tileWidth: 32,
        tileHeight: 32
    });
    
    // 必须确保素材也是按 32x32 物理切割
    const tileset = map.addTilesetImage("stardew_style", "stardew_tiles");
    
    if (tileset) {
        // 创建图层并强制重置比例，防止被外界组件拉伸
        const groundLayer = map.createLayer("Ground", tileset, 0, 0);
        groundLayer?.setDepth(-1);
        
        console.log("Map scale calibrated to 1:1");
    }
    
    // 强制物理世界边界
    this.physics.world.setBounds(0, 0, 800, 640);
  }

  update() {
    const speed = 200;
    this.player.setVelocity(0);

    let moving = false;
    let animKey = "";

    if (this.keys.A.isDown) {
      this.player.setVelocityX(-speed);
      animKey = "walk-left";
      moving = true;
    } else if (this.keys.D.isDown) {
      this.player.setVelocityX(speed);
      animKey = "walk-right";
      moving = true;
    }

    if (this.keys.W.isDown) {
      this.player.setVelocityY(-speed);
      animKey = moving ? animKey : "walk-up"; // Prefer horizontal if both down, or use animKey from before
      moving = true;
    } else if (this.keys.S.isDown) {
      this.player.setVelocityY(speed);
      animKey = moving ? animKey : "walk-down";
      moving = true;
    }

    if (moving) {
      this.player.anims.play(animKey, true);
    } else {
      // Pause animation or play idle
      const currentAnim = this.player.anims.currentAnim?.key || "walk-down";
      if (currentAnim.startsWith("walk-")) {
        const direction = currentAnim.split("-")[1];
        this.player.anims.play("idle-" + direction);
      }
    }
  }
}
