import { AuthGuard } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";


@Injectable()
export class LocalAuthGuard extends AuthGuard("local-user") {
}

@Injectable()
export class LocalEnterpriseAuthGuard extends AuthGuard("local-enterprise") {
}

@Injectable()
export class LocalAdminAuthGuard extends AuthGuard("local-admin") {
}