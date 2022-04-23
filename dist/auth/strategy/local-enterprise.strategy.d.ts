import { Strategy } from "passport-local";
import { EnterprisePrincipal } from "../interface/enterprise-principal";
import { ModuleRef } from "@nestjs/core";
declare const LocalEnterpriseStrategy_base: new (...args: any[]) => Strategy;
export declare class LocalEnterpriseStrategy extends LocalEnterpriseStrategy_base {
    private moduleRef;
    constructor(moduleRef: ModuleRef);
    validate(req: Request, username: string, password: string): Promise<EnterprisePrincipal>;
}
export {};
