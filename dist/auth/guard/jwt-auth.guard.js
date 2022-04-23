"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAdminAuthGuard = exports.JwtEnterpriseAuthGuard = exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_type_enum_1 = require("../../shared/roles-type.enum");
const core_1 = require("@nestjs/core");
const api_metadata_1 = require("../../shared/api-metadata");
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)("jwt-user") {
    constructor(reflector) {
        super();
        this.reflector = reflector;
    }
    canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(api_metadata_1.METADATA.PUBLIC, [context.getHandler, context.getClass]);
        if (isPublic)
            return true;
        return super.canActivate(context);
    }
    handleRequest(err, user) {
        if (!user || err || user.role != roles_type_enum_1.RolesType.CUSTOMER) {
            throw new common_1.UnauthorizedException();
        }
        return user;
    }
};
JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], JwtAuthGuard);
exports.JwtAuthGuard = JwtAuthGuard;
let JwtEnterpriseAuthGuard = class JwtEnterpriseAuthGuard extends (0, passport_1.AuthGuard)("jwt-enterprise") {
    constructor(reflector) {
        super();
        this.reflector = reflector;
    }
    canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(api_metadata_1.METADATA.PUBLIC, [context.getHandler(), context.getClass()]);
        if (isPublic)
            return true;
        return super.canActivate(context);
    }
    handleRequest(err, user) {
        if (!user || err || user.role != roles_type_enum_1.RolesType.PROVIDER) {
            throw new common_1.UnauthorizedException();
        }
        return user;
    }
};
JwtEnterpriseAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], JwtEnterpriseAuthGuard);
exports.JwtEnterpriseAuthGuard = JwtEnterpriseAuthGuard;
let JwtAdminAuthGuard = class JwtAdminAuthGuard extends (0, passport_1.AuthGuard)("jwt-admin") {
    constructor(reflector) {
        super();
        this.reflector = reflector;
    }
    canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(api_metadata_1.METADATA.PUBLIC, [context.getHandler(), context.getClass()]);
        if (isPublic)
            return true;
        return super.canActivate(context);
    }
    handleRequest(err, user) {
        if (!user || err || user.role != roles_type_enum_1.RolesType.ADMIN) {
            throw new common_1.UnauthorizedException();
        }
        return user;
    }
};
JwtAdminAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], JwtAdminAuthGuard);
exports.JwtAdminAuthGuard = JwtAdminAuthGuard;
//# sourceMappingURL=jwt-auth.guard.js.map