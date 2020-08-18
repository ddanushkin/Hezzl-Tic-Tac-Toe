import { Scene } from 'phaser'
import RestartButtonSprite from '../assets/RestartButtonSprite.png';
import ResultSprite from '../assets/ResultSprite.png';
import WinParticleSprite from '../assets/WinParticleSprite.png';
import LoseParticleSprite from '../assets/LoseParticleSprite.png';

export class GameOver extends Scene {
    constructor() {
        super({ key: 'GameOver' })
    }

    init(data)
    {
        this.isWin = data.isWin;
    }

    preload() {
        this.load.image('RestartButtonSprite', RestartButtonSprite);
        this.load.spritesheet('WinParticleSprite', WinParticleSprite, { frameWidth: 32, frameHeight: 32, endFrame: 4 });
        this.load.spritesheet('LoseParticleSprite', LoseParticleSprite, { frameWidth: 32, frameHeight: 32, endFrame: 4 });
        this.load.spritesheet('ResultSprite', ResultSprite, { frameWidth: 215, frameHeight: 93, endFrame: 2 });
    }
    
    create() {
        const centerX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const centerY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        const particles = this.add.particles(this.isWin ? 'WinParticleSprite' : 'LoseParticleSprite');

        this.emitter = particles.createEmitter({
            frame: [0, 1, 2, 3],
            x: centerX,
            y: centerY,
            quantity: 2,
            frequency: 500,
            rotate: {start: 0, end: 360},
            speed: 75,
            gravityY: 0,
            lifespan: 5000,
            scale: {start: 2, end: 0}
        });

        this.resultSprite = this.add.sprite(centerX, centerY - 100, 'ResultSprite').setOrigin(0.5, 0.5).setFrame(this.isWin ? 0 : 1);

        this.restartButton = this.add.sprite(centerX, centerY, 'RestartButtonSprite');
        this.restartButton.setOrigin(0.5, 0.5);
        this.restartButton.setInteractive();
        this.restartButton.on('pointerdown', () => this.scene.start('GamePlay'));
    }
}

export default GameOver