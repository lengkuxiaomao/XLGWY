import Phaser from 'phaser';

export class MainScene extends Phaser.Scene {
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private keys!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key; };

  constructor() {
    super('MainScene');
  }

  preload() {
    // Load hero sprite sheet. 8 columns, 2 rows. 347x167 -> ~43.3x83.5
    // Let's use 43.375 and 83.5 for frameWidth and frameHeight if Phaser accepts it.
    // Or just 43 and 83 and see.
    this.load.spritesheet('hero', 'assets/hero.jpg', { 
      frameWidth: 347 / 8, 
      frameHeight: 167 / 2 
    });
  }

  create() {
    this.createMap();
    
    // Create animations
    // Row 1, Columns 1-4: Walking Away (Up direction)
    this.anims.create({
      key: 'walk-up',
      frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });

    // Row 1, Columns 5-8: Walking Towards (Down direction)
    this.anims.create({
      key: 'walk-down',
      frames: this.anims.generateFrameNumbers('hero', { start: 4, end: 7 }),
      frameRate: 8,
      repeat: -1
    });

    // Row 2, Columns 1-4: Walking Right (Right direction)
    this.anims.create({
      key: 'walk-right',
      frames: this.anims.generateFrameNumbers('hero', { start: 8, end: 11 }),
      frameRate: 8,
      repeat: -1
    });

    // Row 2, Columns 5-8: Walking Left (Left direction)
    this.anims.create({
      key: 'walk-left',
      frames: this.anims.generateFrameNumbers('hero', { start: 12, end: 15 }),
      frameRate: 8,
      repeat: -1
    });

    // Idle animations (using first frame of each direction)
    this.anims.create({ key: 'idle-up', frames: [{ key: 'hero', frame: 0 }] });
    this.anims.create({ key: 'idle-down', frames: [{ key: 'hero', frame: 4 }] });
    this.anims.create({ key: 'idle-right', frames: [{ key: 'hero', frame: 8 }] });
    this.anims.create({ key: 'idle-left', frames: [{ key: 'hero', frame: 12 }] });

    // Create player sprite
    this.player = this.physics.add.sprite(400, 300, 'hero', 4);
    this.player.setCollideWorldBounds(true);
    
    // Simple input - WASD
    this.keys = this.input.keyboard!.addKeys('W,A,S,D') as any;
  }

  createMap() {
    const mapWidth = 25;
    const mapHeight = 20;
    const tileSize = 32;
    
    for (let y = 0; y < mapHeight; y++) {
      for (let x = 0; x < mapWidth; x++) {
        const color = (x + y) % 2 === 0 ? 0x228B22 : 0x32CD32;
        this.add.rectangle(x * tileSize + tileSize/2, y * tileSize + tileSize/2, tileSize, tileSize, color);
      }
    }
  }

  update() {
    const speed = 200;
    this.player.setVelocity(0);

    let moving = false;
    let animKey = '';

    if (this.keys.A.isDown) {
      this.player.setVelocityX(-speed);
      animKey = 'walk-left';
      moving = true;
    } else if (this.keys.D.isDown) {
      this.player.setVelocityX(speed);
      animKey = 'walk-right';
      moving = true;
    }

    if (this.keys.W.isDown) {
      this.player.setVelocityY(-speed);
      animKey = moving ? animKey : 'walk-up'; // Prefer horizontal if both down, or use animKey from before
      moving = true;
    } else if (this.keys.S.isDown) {
      this.player.setVelocityY(speed);
      animKey = moving ? animKey : 'walk-down';
      moving = true;
    }

    if (moving) {
      this.player.anims.play(animKey, true);
    } else {
      // Pause animation or play idle
      const currentAnim = this.player.anims.currentAnim?.key || 'walk-down';
      if (currentAnim.startsWith('walk-')) {
        const direction = currentAnim.split('-')[1];
        this.player.anims.play('idle-' + direction);
      }
    }
  }
}
