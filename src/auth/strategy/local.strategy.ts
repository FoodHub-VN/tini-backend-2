import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { lastValueFrom } from "rxjs";
import { UserPrincipal } from "../interface/user-principal";
import { ContextIdFactory, ModuleRef } from "@nestjs/core";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local-user") {
    constructor(private moduleRef: ModuleRef) {
        super({
            usernameField: "username",
            passwordField: "password",
            passReqToCallback: true
        });
    }

    async validate(req: Request, username: string, password: string): Promise<UserPrincipal> {
        const contextId = ContextIdFactory.getByRequest(req);
        // "AuthService" is a request-scoped provider
        const authService = await this.moduleRef.resolve(AuthService, contextId);
        const user: UserPrincipal = await lastValueFrom(authService.validateUser(username, password));
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
