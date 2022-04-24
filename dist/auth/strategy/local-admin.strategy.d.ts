import { Strategy } from "passport-local";
import { ModuleRef } from "@nestjs/core";
import { AdminPrincipal } from "../interface/admin-principal";
declare const LocalAdminStrategy_base: new (...args: any[]) => Strategy;
export declare class LocalAdminStrategy extends LocalAdminStrategy_base {
    private moduleRef;
    constructor(moduleRef: ModuleRef);
    validate(req: Request, username: string, password: string): Promise<AdminPrincipal>;
}
export {};
