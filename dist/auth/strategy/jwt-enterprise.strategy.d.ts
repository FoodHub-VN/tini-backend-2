import { Strategy } from "passport-jwt";
import jwtConfig from "../../config/jwtConfig.config";
import { ConfigType } from "@nestjs/config";
import { JwtEnterprisePayload } from "../interface/jwt-payload.interface";
import { EnterprisePrincipal } from "../interface/enterprise-principal";
declare const JwtEnterpriseStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtEnterpriseStrategy extends JwtEnterpriseStrategy_base {
    constructor(config: ConfigType<typeof jwtConfig>);
    validate(payload: JwtEnterprisePayload): EnterprisePrincipal;
}
export {};
