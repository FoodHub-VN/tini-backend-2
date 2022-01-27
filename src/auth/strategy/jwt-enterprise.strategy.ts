import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import jwtConfig from "../../config/jwtConfig.config";
import { ConfigType } from "@nestjs/config";
import { JwtEnterprisePayload } from "../interface/jwt-payload.interface";
import { EnterprisePrincipal } from "../interface/enterprise-principal";

@Injectable()
export class JwtEnterpriseStrategy extends PassportStrategy(Strategy, "jwt-enterprise") {
  constructor(@Inject(jwtConfig.KEY) config: ConfigType<typeof jwtConfig>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: config.secretKey
    });
  }

  validate(payload: JwtEnterprisePayload): EnterprisePrincipal {
    return {
      ...payload
    } as EnterprisePrincipal;
  }
}
