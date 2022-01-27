import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { lastValueFrom } from "rxjs";
import { EnterprisePrincipal } from "../interface/enterprise-principal";
import { ContextIdFactory, ModuleRef } from "@nestjs/core";

@Injectable()
export class LocalEnterpriseStrategy extends PassportStrategy(Strategy, "local-enterprise") {
  constructor(private moduleRef: ModuleRef) {
    super({
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true
    });
  }

  async validate(req: Request, username: string, password: string): Promise<EnterprisePrincipal> {
    const contextId = ContextIdFactory.getByRequest(req);
    // "AuthService" is a request-scoped provider
    const authService = await this.moduleRef.resolve(AuthService, contextId);
    const user: EnterprisePrincipal = await lastValueFrom(authService.validateEnterprise(username, password));
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
