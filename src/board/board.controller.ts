import { HttpService } from '@nestjs/axios/dist';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Chess, Square } from '../../node_modules/chess.js/dist/chess';
import { MoveDto } from './move.dto';

@Controller('board')
export class BoardController {
    private chess: Chess;

    constructor(private readonly httpService: HttpService) {
        this.chess = new Chess();
    }

    @Get('/')
    getBoard(): Object[] {
        let board = this.chess.board();
        let square: Square;

        for (let indexRow in board) {
            for (let indexCell in board[indexRow]) {
                if (board[indexRow][indexCell] === null) {
                    square = (String.fromCharCode(97 + parseInt(indexCell)) + (8 - parseInt(indexRow))) as Square;
                    board[indexRow][indexCell] = { square: square, type: null, color: null };
                }
            }
        }

        return board;
    }

    @Post('/new-game')
    newGame() {
        this.chess.reset();
    }

    @Post('/move')
    async move(@Body() moveDto: MoveDto) {
        console.log(moveDto);

        this.chess.move(moveDto.move);

        const iaMove = await this.getIaMove(this.chess.fen());
        // Random move if no best move
        if (iaMove) {
            this.chess.move(iaMove);
        } else {
            const moves = this.chess.moves();
            this.chess.move(moves[Math.floor(Math.random() * moves.length)]);
        }
    }

    async getIaMove(fen: string): Promise<string> {
        console.log(fen);
        const url = 'https://www.chessdb.cn/cdb.php?action=querybest&board=' + fen + '&json=1';

        const { data } = await firstValueFrom(this.httpService.get(url));
        console.log(data);

        return data.move;
    }
}
