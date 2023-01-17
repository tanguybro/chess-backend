import { HttpService } from '@nestjs/axios/dist';
import { Controller, Get, Res } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Controller('board')
export class BoardController {
    private board = [];

    constructor(private readonly httpService: HttpService) {}

    @Get('/')
    getBoard(@Req() request: Request, @Res() res) {
        const iaMove = this.getIaMove();

        console.log(iaMove);

        return res.data(bestMove);

        return res.json([
            ['e4', 'e5'],
            ['Cf3', 'Cc6'],
        ]);
    }

    async getIaMove() {
        const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR%20w%20KQkq%20-%200%201';
        const url = 'https://www.chessdb.cn/cdb.php?action=querybest&board=' + fen + '&json=1';

        const { data } = await firstValueFrom(this.httpService.get(url));
        return data;
    }
}
