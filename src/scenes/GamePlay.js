import { Scene } from 'phaser'
import { Cell } from '../Cell';
import CellSprite from '../assets/CellSprite.png';

const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export class GamePlay extends Scene {
    constructor() {
        super({ key: 'GamePlay' })
    }

    initScene() {
        //60% of 5x5 board
        this.movesBeforeExpand = 15;

        //No need to check for winner if less than 9 moves. (player 5 moves + ai 4 moves)
        this.movesBeforeWinCheck = 9;

        this.movesCount = 0;
        this.boardExpanded = false;

        this.playerSign = Math.random() > 0.5 ? Cell.States().Ring : Cell.States().Cross;
        this.aiSign = this.playerSign == Cell.States().Ring ? Cell.States().Cross : Cell.States().Ring;

        this.isPlayerTurn = Math.random() > 0.5 ? false : true;

        //Default min max index for 2d board array, before expand.
        this.minIndex = 3;
        this.maxIndex = 7;

        this.cameras.main.zoom = 2.0;
        this.game.input.enabled = true;
        this.board = this.initBoard();
    }

    addCell(row, col, state) {
        return new Cell({ scene: this, x: col, y: row, defaultState: state, spriteKey: 'CellSprite' });
    }

    initBoard() {
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

    expandBoard() {
        this.game.input.enabled = false;
        this.boardExpanded = true;
        this.minIndex = 0;
        this.maxIndex = 10;
        for (let row = 0; row < 11; row++) {
            for (let col = 0; col < 11; col++) {
                this.board[row][col].enable();
            }
        }
        this.cameras.main.zoomTo(1, 750);
        setTimeout(() => this.game.input.enabled = true, 750);
    }

    checkWin(sign) {
        const directions = this.getCheckDirections();

        for (let row = this.minIndex; row <= this.maxIndex; row++) {
            for (let col = this.minIndex; col <= this.maxIndex; col++) {
                const cell = this.board[row][col];
                if (cell.getSign() == sign) {
                    for (const direction of directions) {
                        if (this.checkWinInDirection(row, col, direction.Row, direction.Col, sign)) {
                            this.drawWinLine(row, col, direction.Row, direction.Col);
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    checkWinInDirection(row, col, dRow, dCol, sign) {
        if (this.isLastCheckOutOfBoard(row, col, dRow, dCol))
            return false;
        return (this.chainLengthInDirection(row, col, dRow, dCol, sign) == 5);
    }

    chainLengthInDirection(row, col, dRow, dCol, sign) {
        let nextRow = row;
        let nextCol = col;
        let chainLength = 1;

        while (chainLength != 5) {
            nextRow += dRow;
            nextCol += dCol;
            if (this.isOutOfBoard(nextRow, nextCol))
                return chainLength;
            const cell = this.board[nextRow][nextCol];
            if (cell.getSign() != sign)
                return chainLength;
            chainLength++;
        }
        return chainLength;
    }

    aiMove() {
        const nextPlayerMove = this.findNextMove(this.playerSign);
        const nextAiMove = this.findNextMove(this.aiSign);

        if (nextAiMove != null && nextAiMove.chainLength == 4) {
            nextAiMove.cell.setSign(this.aiSign);
            return;
        }
        else if (nextPlayerMove != null && nextPlayerMove.chainLength >= 2) {
            nextPlayerMove.cell.setSign(this.aiSign);
            return;
        }

        if (nextAiMove != null)
            nextAiMove.cell.setSign(this.aiSign);
        else
            this.getEmptyCell().setSign(this.aiSign);
    }

    findNextMove(sign) {
        let bestMove = null;
        const directions = this.getCheckDirections();

        for (let row = this.minIndex; row <= this.maxIndex; row++) {
            for (let col = this.minIndex; col <= this.maxIndex; col++) {
                const cell = this.board[row][col];
                if (cell.getSign() == sign) {
                    for (const direction of directions) {
                        const move = this.getNextMoveInDirection(row, col, direction.Row, direction.Col, sign);
                        if (move.cell != null && move.cell.getSign() == Cell.States().Enabled) {
                            if (bestMove == null || move.chainLength >= bestMove.chainLength)
                                bestMove = move;
                        }
                    }
                }
            }
        }
        return bestMove;
    }

    getNextMoveInDirection(row, col, dRow, dCol, sign) {
        const length = this.chainLengthInDirection(row, col, dRow, dCol, sign);
        const nextRow = row + ((length) * dRow);
        const nextCol = col + ((length) * dCol);

        return {
            chainLength: this.chainLengthInDirection(row, col, dRow, dCol, sign),
            cell: this.isOutOfBoard(nextRow, nextCol) ? null : this.board[nextRow][nextCol]
        }
    }

    drawWinLine(startRow, startCol, dRow, dCol)
    {
        const endRow = startRow + (4 * dRow);
        const endCol = startCol + (4 * dCol);

        const startCell = this.board[startRow][startCol];
        const endCell = this.board[endRow][endCol];

        const line = this.add.graphics();
        line.lineStyle(16, 0xffe600, 0.5);
        line.beginPath();
        line.moveTo(startCell.x, startCell.y);
        line.lineTo(endCell.x, endCell.y);
        line.closePath();
        line.strokePath();
    }

    getCheckDirections() {
        const checkDirections = [
            { Row: 0, Col: 1 },
            { Row: 0, Col: -1 },
            { Row: 1, Col: 0 },
            { Row: -1, Col: 0 },
            { Row: 1, Col: 1 },
            { Row: 1, Col: -1 },
            { Row: -1, Col: 1 },
            { Row: -1, Col: -1 },
        ];

        //Shuffle an array  
        return checkDirections.sort(() => Math.random() - 0.5);
    }

    getRandomCell() {
        return this.board[getRandomInt(this.minIndex, this.maxIndex)][getRandomInt(this.minIndex, this.maxIndex)];
    }

    getEmptyCell() {
        let iMax = (this.maxIndex - this.minIndex) + 1;
        iMax *= iMax;
        iMax -= this.movesCount;

        let i = 0;
        let cell;
        while (i < iMax) {
            cell = this.getRandomCell();
            if (cell != null && cell.getSign() == Cell.States().Enabled)
                return cell;
            i++;
        }
        return null;
    }

    isOutOfBoard(row, col) {
        return (
            row < this.minIndex ||
            row > this.maxIndex ||
            col < this.minIndex ||
            col > this.maxIndex);
    }

    isLastCheckOutOfBoard(row, col, dRow, dCol) {
        const lastRowIndex = row + (4 * dRow);
        const lastColIndex = col + (4 * dCol);
        return this.isOutOfBoard(lastRowIndex, lastColIndex);
    }

    preload() {
        this.load.spritesheet('CellSprite', CellSprite, { frameWidth: 64, frameHeight: 64, endFrame: 4 });
    }

    create() {
        this.initScene();

        this.events.off('boardChange');
        this.events.on('boardChange', (sign) => {
            this.movesCount++;
            this.isPlayerTurn = !this.isPlayerTurn;
            if (this.movesCount >= this.movesBeforeWinCheck && this.checkWin(sign))
            {
                this.gameOver();
                return;
            }
            if (!this.boardExpanded && this.movesCount > this.movesBeforeExpand)
                this.expandBoard();
            if (!this.isPlayerTurn)
                this.aiMove();
        });

        if (!this.isPlayerTurn)
            this.aiMove();
    }

    gameOver()
    {
        this.game.input.enabled = false;
        setTimeout(() => this.scene.restart(), 1000);
    }
}

export default GamePlay