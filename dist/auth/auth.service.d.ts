import { UserPrincipal } from "./interface/user-principal";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { AccessToken } from "./interface/access-token.interface";
import { EnterprisePrincipal } from "./interface/enterprise-principal";
import { EnterpriseService } from "../enterprise/enterprise.service";
import { AdminPrincipal } from "./interface/admin-principal";
export declare class AuthService {
    private jwtService;
    private userService;
    private enterpriseService;
    constructor(jwtService: JwtService, userService: UserService, enterpriseService: EnterpriseService);
    validateUser(username: string, password: string): Observable<UserPrincipal>;
    validateEnterprise(username: string, password: string): Observable<EnterprisePrincipal>;
    validateAdmin(username: string, password: string): Observable<AdminPrincipal>;
    login(user: UserPrincipal): Observable<any>;
    loginEnterprise(enterprise: EnterprisePrincipal): Observable<any>;
    loginAdmin(admin: AdminPrincipal): Observable<AccessToken>;
}
