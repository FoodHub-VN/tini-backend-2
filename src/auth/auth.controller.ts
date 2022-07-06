import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import {Response} from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post('')
    getToken(@Res() res: Response, @Body() data: any) {
        this.authService.sign(data);
        return res.status(HttpStatus.OK).send({hello: "hello"})
    }
}
