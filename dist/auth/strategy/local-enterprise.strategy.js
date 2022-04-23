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
exports.LocalEnterpriseStrategy = void 0;
const passport_1 = require("@nestjs/passport");
const passport_local_1 = require("passport-local");
const auth_service_1 = require("../auth.service");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const core_1 = require("@nestjs/core");
let LocalEnterpriseStrategy = class LocalEnterpriseStrategy extends (0, passport_1.PassportStrategy)(passport_local_1.Strategy, "local-enterprise") {
    constructor(moduleRef) {
        super({
            usernameField: "username",
            passwordField: "password",
            passReqToCallback: true
        });
        this.moduleRef = moduleRef;
    }
    async validate(req, username, password) {
        const contextId = core_1.ContextIdFactory.getByRequest(req);
        const authService = await this.moduleRef.resolve(auth_service_1.AuthService, contextId);
        const user = await (0, rxjs_1.lastValueFrom)(authService.validateEnterprise(username, password));
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        return user;
    }
};
LocalEnterpriseStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.ModuleRef])
], LocalEnterpriseStrategy);
exports.LocalEnterpriseStrategy = LocalEnterpriseStrategy;
//# sourceMappingURL=local-enterprise.strategy.js.map