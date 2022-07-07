import { Body, Controller, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {Response} from 'express';
import { GetTokenDto } from './dto/get-token.dto';
import { TiniGuard } from './guard/tini.guard';
import { AuthReqInterface } from './interface/auth-req.interface';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post('/getAuthToken')
    async getToken(@Res() res: Response, @Body() data: GetTokenDto) {
        let authCode = await this.authService.exchangeToAccessToken(data);
        return res.status(HttpStatus.OK).send({authCode})
    }
    @Post('/testToken')
    @ApiBearerAuth()
    @UseGuards(TiniGuard)
    async testToken(@Res() res: Response, @Req() req: AuthReqInterface){
        return res.status(HttpStatus.OK).send({user: req.user});
    }
}
