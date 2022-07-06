import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import {Response} from 'express';
import { GetTokenDto } from './dto/get-token.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post('/getAuthToken')
    async getToken(@Res() res: Response, @Body() data: GetTokenDto) {
        let authCode = await this.authService.sign(data);
        return res.status(HttpStatus.OK).send({authCode})
    }
}
