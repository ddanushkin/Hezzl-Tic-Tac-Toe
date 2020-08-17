export class Cell extends Phaser.GameObjects.Sprite {
    constructor(config) {
        const size = config.scene.game.config.width / 12;
        super(
            config.scene,
            config.x * size + size,
            config.y * size + size,
            config.spriteKey
        );
        config.scene.add.existing(this);
        this.setInteractive();
        this.setFrame(config.defaultState);
        this.displayWidth = size;
        this.displayHeight = size;
        this.setOrigin(0.5, 0.5);
        this.row = config.y;
        this.col = config.x;
        this.scene = config.scene;
        this.filled = false;
        this.once('pointerdown', () => this.setSign(this.scene.playerSign));
        this.on('pointerover', () => {
            if (!this.filled && this.getSign() == Cell.States().Enabled)
                this.setFrame(this.scene.playerSign);
        });
        this.on('pointerout', () => {
            if (!this.filled && this.getSign() != Cell.States().Disabled)
                this.setFrame(Cell.States().Enabled);
        });
    }

    setSign(sign) {
        if (!this.filled) {
            this.filled = true;
            this.setFrame(sign);
            this.scene.events.emit('boardChange', sign);
        }
    }

    getSign() {
        return this.frame.name;
    }

    getPosition() {
        return { row: this.row, col: this.col };
    }

    enable() {
        if (this.getSign() == Cell.States().Disabled)
            this.setFrame(Cell.States().Enabled);
    }

    static States() {
        return {
            Disabled: 0,
            Enabled: 1,
            Ring: 2,
            Cross: 3
        };
    }
}
