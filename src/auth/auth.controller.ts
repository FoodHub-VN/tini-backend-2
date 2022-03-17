import { Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAdminAuthGuard, LocalAuthGuard, LocalEnterpriseAuthGuard } from "./guard/local-auth.guard";
import { Response } from "express";
import { map, Observable, of } from "rxjs";
import { JwtAuthGuard, JwtEnterpriseAuthGuard } from "./guard/jwt-auth.guard";
import { LocalEnterpriseStrategy } from "./strategy/local-enterprise.strategy";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @UseGuards(LocalAuthGuard)
    @Post("/login")
    login(@Req() req: any, @Res() res: Response): Observable<Response> {
        return this.authService.login(req.user).pipe(
          map((token) => {
              return res
                .header("Authorization", "Bearer " + token.accessToken)
                .json(token)
                .send();
          })
        );
    }

    @UseGuards(LocalEnterpriseAuthGuard)
    @Post("/login-enterprise")
    loginEnterprise(@Req() req: any, @Res() res: Response): Observable<any> {
        return this.authService.loginEnterprise(req.user).pipe(
          map((token) => {
              return res
                .header("Authorization", "Bearer " + token.accessToken)
                .json(token)
                .send();
          })
        );
    }

    @UseGuards(LocalAdminAuthGuard)
    @Post("/login-admin")
    loginAdmin(@Req() req: any, @Res() res: Response): Observable<any> {
        return this.authService.loginAdmin(req.user).pipe(
          map((token) => {
              return res
                .header("Authorization", "Bearer " + token.accessToken)
                .json(token)
                .send();
          })
        );
    }

    @UseGuards(JwtAuthGuard)
    @Post("/testJwt")
    testJwt(@Req() req: any, @Res() res: Response): Observable<Response> {
        return of(res.status(HttpStatus.OK).send(req.user));
    }

    @UseGuards(JwtAuthGuard)
    @Get('/check-token-user')
    checkTokenUser(@Res() res: Response) : Observable<Response>{
        return of(res.status(HttpStatus.OK).send());
    }
}
