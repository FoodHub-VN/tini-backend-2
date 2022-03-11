import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import jwtConfig from "../../config/jwtConfig.config";
import { ConfigType } from "@nestjs/config";
import { JwtAdminPayload } from "../interface/jwt-payload.interface";
import { AdminPrincipal } from "../interface/admin-principal";

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, "jwt-admin") {
  constructor(@Inject(jwtConfig.KEY) config: ConfigType<typeof jwtConfig>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: config.secretKey
    });
  }

  validate(payload: JwtAdminPayload): AdminPrincipal {
    return {
      ...payload
    } as AdminPrincipal;
  }
}
