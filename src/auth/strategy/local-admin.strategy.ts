import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { lastValueFrom } from "rxjs";
import { EnterprisePrincipal } from "../interface/enterprise-principal";
import { ContextIdFactory, ModuleRef } from "@nestjs/core";
import { AdminPrincipal } from "../interface/admin-principal";

@Injectable()
export class LocalAdminStrategy extends PassportStrategy(Strategy, "local-admin") {
  constructor(private moduleRef: ModuleRef) {
    super({
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true
    });
  }

  async validate(req: Request, username: string, password: string): Promise<AdminPrincipal> {
    const contextId = ContextIdFactory.getByRequest(req);
    // "AuthService" is a request-scoped provider
    const authService = await this.moduleRef.resolve(AuthService, contextId);
    const user: AdminPrincipal = await lastValueFrom(authService.validateAdmin(username, password));
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
