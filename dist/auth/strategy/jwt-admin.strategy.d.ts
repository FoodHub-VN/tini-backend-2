import { Strategy } from "passport-jwt";
import jwtConfig from "../../config/jwtConfig.config";
import { ConfigType } from "@nestjs/config";
import { JwtAdminPayload } from "../interface/jwt-payload.interface";
import { AdminPrincipal } from "../interface/admin-principal";
declare const JwtAdminStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtAdminStrategy extends JwtAdminStrategy_base {
    constructor(config: ConfigType<typeof jwtConfig>);
    validate(payload: JwtAdminPayload): AdminPrincipal;
}
export {};
