import { Strategy } from "passport-local";
import { UserPrincipal } from "../interface/user-principal";
import { ModuleRef } from "@nestjs/core";
declare const LocalStrategy_base: new (...args: any[]) => Strategy;
export declare class LocalStrategy extends LocalStrategy_base {
    private moduleRef;
    constructor(moduleRef: ModuleRef);
    validate(req: Request, username: string, password: string): Promise<UserPrincipal>;
}
export {};
