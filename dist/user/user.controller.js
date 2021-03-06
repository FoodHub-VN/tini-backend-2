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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const tini_guard_1 = require("../auth/guard/tini.guard");
const follow_user_dto_1 = require("./dto/follow-user.dto");
const user_service_1 = require("./user.service");
const swagger_1 = require("@nestjs/swagger");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async getUserById(res, req) {
        try {
            const user = await this.userService.fetchUserById(req.user.customer_id);
            return res.status(common_1.HttpStatus.OK).send({ user });
        }
        catch (e) {
            throw new common_1.BadRequestException();
        }
    }
    async followUser(res, body, req) {
        try {
            let success = await this.userService.followUser(req, body.userId);
            return res.status(common_1.HttpStatus.OK).send({ status: "success" });
        }
        catch (e) {
            throw e;
        }
    }
    async unFollowUser(res, body, req) {
        try {
            let success = await this.userService.unFollowUser(req, body.userId);
            return res.status(common_1.HttpStatus.OK).send({ status: "success" });
        }
        catch (e) {
            throw e;
        }
    }
};
__decorate([
    (0, common_1.Post)('get-info'),
    (0, common_1.UseGuards)(tini_guard_1.TiniGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Post)('follow'),
    (0, common_1.UseGuards)(tini_guard_1.TiniGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, follow_user_dto_1.FollowUserDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "followUser", null);
__decorate([
    (0, common_1.Post)('un-follow'),
    (0, common_1.UseGuards)(tini_guard_1.TiniGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, follow_user_dto_1.UnFollowUserDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "unFollowUser", null);
UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map