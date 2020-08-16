export class Cell extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(
            config.scene,
            config.x * config.size + config.size,
            config.y * config.size + config.size,
            config.spriteKey
        );
        config.scene.add.existing(this);
        this.setInteractive();
        this.setFrame(config.defaultState);
        this.once('pointerdown', () => this.setSign(config.scene));
        this.displayWidth = config.size;
        this.displayHeight = config.size;
        this.setOrigin(0.5, 0.5);
        this.row = config.y;
        this.col = config.x;
    }

    setSign(scene) {
        if (this.getSign() == Cell.States().Enabled) {
            this.setFrame(scene.playerSign);
            scene.events.emit('boardChange', {
                position: this.getPosition(),
                sign: this.getSign()
            });
        }
    }

    getSign() {
        return this.frame.name;
    }

    getPosition() {
        return { row: this.row, col: this.col };
    }

    enable()
    {
        if (this.getSign() == Cell.States().Disabled)
            this.setFrame(Cell.States().Enabled);
    }

    static States()
    {
        return {
            Disabled: 0,
            Enabled:  1,
            Ring:     2,
            Cross:    3
        };
    }
}
