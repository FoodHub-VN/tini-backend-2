import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthGuard } from "@nestjs/passport";
import { RolesType } from "../../shared/roles-type.enum";
import { Reflector } from "@nestjs/core";
import { METADATA } from "../../shared/api-metadata";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt-user") {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(
      context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic = this.reflector.getAllAndOverride(METADATA.PUBLIC, [context.getHandler, context.getClass]);
        if (isPublic) return true;
        return super.canActivate(context);
    }

    handleRequest(err, user) {
        if (!user || err || user.role != RolesType.CUSTOMER) {
            throw new UnauthorizedException();
        }
        return user;
    }
}

@Injectable()
export class JwtEnterpriseAuthGuard extends AuthGuard("jwt-enterprise") {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(
      context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic: boolean = this.reflector.getAllAndOverride(METADATA.PUBLIC, [context.getHandler(), context.getClass()]);
        if(isPublic) return true;
        return super.canActivate(context);
    }

    handleRequest(err, user) {
        if (!user || err || user.role != RolesType.PROVIDER) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
