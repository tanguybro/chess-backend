import { HttpService } from '@nestjs/axios/dist';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { Chess } from 'chess.js';
import { firstValueFrom } from 'rxjs';
import { MoveDto } from './move.dto';

@Controller('board')
export class BoardController {
    private chess: Chess;

    constructor(private readonly httpService: HttpService) {
        this.chess = new Chess();
    }

    @Get('/')
    getBoard() {
        return this.chess.board();
    }

    @Post('/new-game')
    newGame() {
        this.chess.reset();
    }

    @Post('/move')
    async move(@Body() moveDto: MoveDto) {
        this.chess.move(moveDto.move);
        this.chess.move(await this.getIaMove(this.chess.fen()));
    }

    async getIaMove(fen: string): Promise<string> {
        const url = 'https://www.chessdb.cn/cdb.php?action=querybest&board=' + fen + '&json=1';

        const { data } = await firstValueFrom(this.httpService.get(url));
        return data;
    }
}
