import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { lastValueFrom } from "rxjs";
import { EnterprisePrincipal } from "../interface/enterprise-principal";

@Injectable()
export class LocalEnterpriseStrategy extends PassportStrategy(Strategy, "local-enterprise") {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: "username",
      passwordField: "password"
    });
  }

  async validate(username: string, password: string): Promise<EnterprisePrincipal> {
    const user: EnterprisePrincipal = await lastValueFrom(this.authService.validateEnterprise(username, password));
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
