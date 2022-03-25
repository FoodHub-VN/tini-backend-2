import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserPrincipal } from "./interface/user-principal";
import { from, map, mergeMap, Observable, of } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import { JwtAdminPayload, JwtEnterprisePayload, JwtPayload } from "./interface/jwt-payload.interface";
import { UserService } from "../user/user.service";
import { AccessToken } from "./interface/access-token.interface";
import { EnterprisePrincipal } from "./interface/enterprise-principal";
import { EnterpriseService } from "../enterprise/enterprise.service";
import { RolesType } from "../shared/roles-type.enum";
import { AdminPrincipal } from "./interface/admin-principal";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private enterpriseService: EnterpriseService
  ) {
  }

  validateUser(username: string, password: string): Observable<UserPrincipal> {
    return this.userService.findUserByName(username).pipe(
      mergeMap(user => {
        if (!user) {
          throw  new UnauthorizedException("Username not match");
        } else {
          return user.comparePassword(password).pipe(
            map(m => {
              if (m) {
                                return {
                                  username: user.username,
                                  email: user.email,
                                  id: user._id,
                                  fullName: user.fullName,
                                  role: RolesType.CUSTOMER,
                                  avatar: user.avatar?.url
                                } as UserPrincipal;
              } else {
                throw new UnauthorizedException("Password not match");
              }
            })
          );
        }
      })
    );

  }

  validateEnterprise(username: string, password: string): Observable<EnterprisePrincipal> {
    return this.enterpriseService.findEnterpriseByName(username).pipe(
      mergeMap(ep => {
        if (!ep) {
          throw new UnauthorizedException("Enterprise not found");
        } else {
          return ep.comparePassword(password).pipe(
            map(m => {
              if (m) {
                return {
                  username: ep.username,
                  email: ep.email,
                  id: ep._id,
                  phone: ep.phone,
                  role: RolesType.PROVIDER
                } as EnterprisePrincipal;
              } else {
                throw new UnauthorizedException("Password is incorrect");
              }
            })
          );
        }
      })
    );
  }

  validateAdmin(username: string, password: string): Observable<AdminPrincipal> {
    if (username == "longhuynh" && password == "longhuynh") {
      return of({
        username: "longhuynh",
        role: RolesType.ADMIN
      } as AdminPrincipal);
    } else {
      throw new UnauthorizedException("Account not correct");
    }
  }

  login(user: UserPrincipal): Observable<any> {
    const payload: JwtPayload = { ...user };
    return from(this.jwtService.signAsync(payload)).pipe(
      map((access_token) => {
        return { accessToken: access_token, user: user };
      })
    );
  }

  loginEnterprise(enterprise: EnterprisePrincipal): Observable<AccessToken> {
    const payload: JwtEnterprisePayload = { ...enterprise };
    return from(this.jwtService.signAsync(payload)).pipe(
      map((access_token) => {
        return { accessToken: access_token } as AccessToken;
      })
    );
  }
  loginAdmin(admin: AdminPrincipal): Observable<AccessToken> {
    const payload: JwtAdminPayload = { ...admin };
    return from(this.jwtService.signAsync(payload)).pipe(
      map((access_token) => {
        return { accessToken: access_token } as AccessToken;
      })
    );
  }

}
