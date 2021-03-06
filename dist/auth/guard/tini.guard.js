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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TiniGuard = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../auth.service");
const database_constants_1 = require("../../database/database.constants");
let TiniGuard = class TiniGuard {
    constructor(authService, userModel) {
        this.authService = authService;
        this.userModel = userModel;
    }
    async canActivate(context) {
        let req = context.switchToHttp().getRequest();
        let token = req.headers.authorization;
        if (!token)
            throw new common_1.UnauthorizedException('Lỗi xác thực!');
        try {
            const user = await this.authService.validateToken(token);
            if (!user)
                throw new common_1.UnauthorizedException('Lỗi xác thực!');
            req.user = user;
            const existUser = await this.userModel.exists({ _id: user.customer_id });
            if (!existUser) {
                await this.userModel.create({ _id: user.customer_id, customerName: user.customer_name });
            }
            return true;
        }
        catch (e) {
            throw e;
        }
        return false;
    }
};
TiniGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(database_constants_1.USER_MODEL)),
    __metadata("design:paramtypes", [auth_service_1.AuthService, Object])
], TiniGuard);
exports.TiniGuard = TiniGuard;
//# sourceMappingURL=tini.guard.js.map