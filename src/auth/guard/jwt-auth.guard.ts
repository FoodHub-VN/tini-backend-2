import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import {Observable} from 'rxjs';
import {AuthGuard} from "@nestjs/passport";
import { RolesType } from "../../shared/roles-type.enum";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt-user') {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
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
export class JwtEnterpriseAuthGuard extends AuthGuard('jwt-enterprise') {
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context);
    }

    handleRequest(err, user) {
        if (!user || err || user.role != RolesType.PROVIDER) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
