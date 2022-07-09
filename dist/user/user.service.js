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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const database_constants_1 = require("../database/database.constants");
let UserService = class UserService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async followUser(req, userId) {
        try {
            let user = await this.userModel.findOne({ _id: req.user.customer_id }).exec();
            let userFollow = await this.userModel.findOne({ _id: userId }).exec();
            if (!user || !userFollow) {
                throw new common_1.NotFoundException('User not found!');
            }
            let following = user.following.filter(u => u != userId);
            following.push(userId);
            let follower = userFollow.follower.filter(u => u != user._id);
            follower.push(user._id);
            await user.update({ following }).exec();
            await userFollow.update({ follower }).exec();
            return true;
        }
        catch (e) {
            throw e;
        }
    }
    async unFollowUser(req, userId) {
        try {
            let user = await this.userModel.findOne({ _id: req.user.customer_id }).exec();
            let userUnFollow = await this.userModel.findOne({ _id: userId }).exec();
            if (!user || !userUnFollow) {
                throw new common_1.NotFoundException('User not found!');
            }
            let following = user.following.filter(u => u != userId);
            let follower = userUnFollow.follower.filter(u => u != user._id);
            await user.update({ following }).exec();
            await userUnFollow.update({ follower }).exec();
            return true;
        }
        catch (e) {
            throw e;
        }
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_constants_1.USER_MODEL)),
    __metadata("design:paramtypes", [Object])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map