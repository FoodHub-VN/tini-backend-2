"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalAdminAuthGuard = exports.LocalEnterpriseAuthGuard = exports.LocalAuthGuard = void 0;
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
let LocalAuthGuard = class LocalAuthGuard extends (0, passport_1.AuthGuard)("local-user") {
};
LocalAuthGuard = __decorate([
    (0, common_1.Injectable)()
], LocalAuthGuard);
exports.LocalAuthGuard = LocalAuthGuard;
let LocalEnterpriseAuthGuard = class LocalEnterpriseAuthGuard extends (0, passport_1.AuthGuard)("local-enterprise") {
};
LocalEnterpriseAuthGuard = __decorate([
    (0, common_1.Injectable)()
], LocalEnterpriseAuthGuard);
exports.LocalEnterpriseAuthGuard = LocalEnterpriseAuthGuard;
let LocalAdminAuthGuard = class LocalAdminAuthGuard extends (0, passport_1.AuthGuard)("local-admin") {
};
LocalAdminAuthGuard = __decorate([
    (0, common_1.Injectable)()
], LocalAdminAuthGuard);
exports.LocalAdminAuthGuard = LocalAdminAuthGuard;
//# sourceMappingURL=local-auth.guard.js.map