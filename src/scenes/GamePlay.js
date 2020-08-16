import { Scene } from 'phaser'
import { Cell } from './Cell';

export class GamePlay extends Scene
{
    constructor()
    {
        super({ key: 'GamePlay', active: true })
    }

    addCell(row, col, state)
    {
        return new Cell({ scene: this, x: col, y: row, defaultState: state, spriteKey: 'CellSprite' });
    }

    initBoard()
    {
        const board = Array.from(Array(11), () => new Array(11));
        for (let row = 0; row < 11; row++) {
            for (let col = 0; col < 11; col++) {
                if ((row > 2 && row < 8) && (col > 2 && col < 8))
                    board[row][col] = this.addCell(row, col, Cell.States().Enabled);
                else
                    board[row][col] = this.addCell(row, col, Cell.States().Disabled);    
            }
        }
        return board;
    }

    boardExpand()
    {
        this.game.input.enabled = false;
        this.boardExpanded = true;
        for (let row = 0; row < 11; row++) {
            for (let col = 0; col < 11; col++) {
                this.board[row][col].enable();
            }
        }
        this.cameras.main.zoomTo(1, 750);
        setTimeout(() => this.game.input.enabled = true, 750);
        this.minIndex = 0;
        this.maxIndex = 10;
    }

    checkWin(moveData)
    {
        const row = moveData.position.row;
        const col = moveData.position.col;
        const sign = moveData.sign;
        return (
            this.checkWinInDirection(row, col, 0, 1, sign) ||
            this.checkWinInDirection(row, col, 0, -1, sign) ||
            this.checkWinInDirection(row, col, 1, 0, sign) ||
            this.checkWinInDirection(row, col, -1, 0, sign) ||
            this.checkWinInDirection(row, col, 1, 1, sign) ||
            this.checkWinInDirection(row, col, 1, -1, sign) ||
            this.checkWinInDirection(row, col, -1, 1, sign) ||
            this.checkWinInDirection(row, col, -1, -1, sign)
        );
    }

    checkWinInDirection(row, col, dRow, dCol, sign) 
    {

        if (this.isLastCheckOutOfBoard(row, col, dRow, dCol))
            return false;

        let nextRow = row;
        let nextCol = col;    
        for (let i = 0; i < 4; i++) {
            nextRow += dRow;
            nextCol += dCol;
            const cell = this.board[nextRow][nextCol];
            if (cell.getSign() != sign)
                return false;
        }
        return true;

    }

    isLastCheckOutOfBoard(row, col, dRow, dCol)
    {
        const lastRowIndexInCheck = row + (4 * dRow);
        const lastColIndexInCheck = col + (4 * dCol);
        console.log('Last index', [lastRowIndexInCheck, lastColIndexInCheck]);
        return (
            lastRowIndexInCheck < this.minIndex ||
            lastRowIndexInCheck > this.maxIndex ||
            lastColIndexInCheck < this.minIndex ||
            lastColIndexInCheck > this.maxIndex);
    }

    preload ()
    {
        this.load.spritesheet('CellSprite', 'src/assets/CellSprite.png', { frameWidth: 64, frameHeight: 64, endFrame: 4 });
    }

    create ()
    {
        this.activeCellsBeforeExpand = 15;
        this.activeCellsBeforeWinCheck = 9;

        this.activeCellsCount = 0;
        this.boardExpanded = false;
        this.playerSign = Math.random() > 0.5 ? Cell.States().Ring : Cell.States().Cross; 
        this.isPlayerTurn = Math.random() > 0.5 ? false : true;
        this.minIndex = 3;
        this.maxIndex = 7;
        this.cameras.main.zoom = 2.0;

        this.board = this.initBoard();

        this.events.on('boardChange', (moveData) => {
            console.log('BoardChange!', moveData);
            this.activeCellsCount++;
            if (!this.boardExpanded && this.activeCellsCount > this.activeCellsBeforeExpand)
                this.boardExpand();
            if (this.activeCellsCount >= this.activeCellsBeforeWinCheck)
                console.log('Check!', this.checkWin(moveData));
            this.playerSign = this.playerSign == Cell.States().Ring ? Cell.States().Cross : Cell.States().Ring;    
        });
    }
}

export default GamePlay