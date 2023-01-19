import { HttpService } from '@nestjs/axios/dist';
import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
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
        try {
            this.chess.move(moveDto.move);
        } catch (error) {
            console.log(error);
            throw new HttpException('Invalid move', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        console.log(await this.getIaMove(this.chess.fen()));
        this.chess.move(await this.getIaMove(this.chess.fen()));

        console.log(this.chess.ascii());
    }

    async getIaMove(fen: string): Promise<string> {
        const url = 'https://www.chessdb.cn/cdb.php?action=querybest&board=' + fen + '&json=1';

        const { data } = await firstValueFrom(this.httpService.get(url));
        return data.move;
    }
}
