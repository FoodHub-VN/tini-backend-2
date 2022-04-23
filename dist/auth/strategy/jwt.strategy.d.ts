import { Strategy } from "passport-jwt";
import jwtConfig from "../../config/jwtConfig.config";
import { ConfigType } from "@nestjs/config";
import { UserPrincipal } from "../interface/user-principal";
import { JwtPayload } from "../interface/jwt-payload.interface";
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor(config: ConfigType<typeof jwtConfig>);
    validate(payload: JwtPayload): UserPrincipal;
}
export {};
