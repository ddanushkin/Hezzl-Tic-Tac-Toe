import { Scene } from 'phaser'

const cellStates = {
    disabled: 0,
    enabled:  1,
    ring:     2,
    cross:    3
}

export class GamePlay extends Scene {
    constructor() {
        super({ key: 'GamePlay', active: true })
    }

    preload ()
    {
        this.load.spritesheet('CellSprite', 'src/assets/CellSprite.png', { frameWidth: 64, frameHeight: 64, endFrame: 4 });
    }

    create ()
    {
        const initCell = (row, col, cellSize, cellState) => {
            const sprite = this.add.sprite(row * cellSize + cellSize, col * cellSize + cellSize, 'CellSprite').setOrigin(0.5, 0.5);
            sprite.displayWidth = cellSize;
            sprite.displayHeight = cellSize;
            sprite.setInteractive();
            sprite.setFrame(cellState);

            sprite.on('pointerdown', (pointer) => {
                console.log(sprite.frame);
                if (sprite.frame.name == cellStates.enabled)
                {
                    sprite.setFrame(this.playerSign);
                    this.playerSign = this.playerSign == cellStates.ring ? cellStates.cross : cellStates.ring;
                    this.activeCellsCount++;
                    console.log(pointer);
                }
            });
            return sprite;
        };

        const initBoard = (cellSize) => {
            const board = Array.from(Array(11), () => new Array(11));
            for (let row = 0; row < 11; row++) {
                for (let col = 0; col < 11; col++) {
                    if ((row > 2 && row < 8) && (col > 2 && col < 8))
                        board[row][col] = initCell(row, col, cellSize, cellStates.enabled);
                    else
                        board[row][col] = initCell(row, col, cellSize, cellStates.disabled);    
                }
            }
            return board;
        }

        const checkWin = () => {
            for (let row = 0; row < 11; row++) {
                for (let col = 0; col < 11; col++) {

                }
            }
        }

        this.board = initBoard(this.game.config.width / 12);
        this.activeCellsCount = 0;
        this.activeCellsBeforeExpand = 15;
        this.expanded = false;
        this.playerSign = Math.random() > 0.5 ? cellStates.ring : cellStates.cross; 
        this.isPlayerTurn = Math.random() > 0.5 ? false : true;
        this.cameras.main.zoom = 2.0;
        
        // this.input.once('pointerdown', (event) => {
        //     this.scene.start('sceneC');
        // }, this);
    }

    update(){
        const boardExpand = () => {
            this.game.input.enabled = false;
            this.expanded = true;
            for (let row = 0; row < 11; row++) {
                for (let col = 0; col < 11; col++) {
                    const sprite = this.board[row][col];
                    if (sprite.frame.name == cellStates.disabled)
                        sprite.setFrame(cellStates.enabled);
                }
            }
            this.cameras.main.zoomTo(1, 750);
            setTimeout(() => this.game.input.enabled = true, 750);
        }

        if (!this.expanded && this.activeCellsCount > this.activeCellsBeforeExpand)
            boardExpand();
    }
}

export default GamePlay