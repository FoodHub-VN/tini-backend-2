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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const register_dto_1 = require("./dto/register.dto");
const rxjs_1 = require("rxjs");
const jwt_auth_guard_1 = require("../auth/guard/jwt-auth.guard");
const update_dto_1 = require("./dto/update.dto");
const has_role_decorator_1 = require("../auth/guard/has-role.decorator");
const roles_type_enum_1 = require("../shared/roles-type.enum");
const roles_guard_1 = require("../auth/guard/roles.guard");
const platform_express_1 = require("@nestjs/platform-express");
const add_schedule_dto_1 = require("./dto/add-schedule.dto");
const done_schedule_dto_1 = require("./dto/done-schedule.dto");
const add_favorite_dto_1 = require("./dto/add-favorite.dto");
const rating_service_dto_1 = require("./dto/rating-service.dto");
const like_comment_dto_1 = require("./dto/like-comment.dto");
const delete_comment_dto_1 = require("./dto/delete-comment.dto");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    register(data, res) {
        const { username, email } = data;
        return this.userService.existByUsername(username).pipe((0, rxjs_1.mergeMap)(isUsernameExist => {
            if (isUsernameExist) {
                throw new common_1.ConflictException(`Username: ${username} is exist!`);
            }
            else {
                return this.userService.existByMail(email).pipe((0, rxjs_1.mergeMap)((isEmailExist) => {
                    if (isEmailExist) {
                        throw new common_1.ConflictException(`Email: ${email} is exist!`);
                    }
                    else {
                        return this.userService.register(data)
                            .pipe((0, rxjs_1.map)(user => res
                            .status(common_1.HttpStatus.OK)
                            .send({
                            username: username,
                            email: email
                        })));
                    }
                }));
            }
        }));
    }
    profile(req, res) {
        return this.userService.findUserByName(req.user.username, true).pipe((0, rxjs_1.map)(user => {
            const { password, avatar } = user, data = __rest(user, ["password", "avatar"]);
            if (user) {
                return res
                    .status(common_1.HttpStatus.OK)
                    .send({ user: Object.assign(Object.assign({}, data), { avatar: avatar }) });
            }
            else {
                throw new common_1.NotFoundException('User not found!');
            }
        }));
    }
    update(req, res, body) {
        return this.userService.updateProfile(req.user.username, body).pipe((0, rxjs_1.map)(u => {
            var _a;
            if (u) {
                return res.status(common_1.HttpStatus.OK).send({ user: Object.assign(Object.assign({}, u), { avatar: (_a = u.avatar) === null || _a === void 0 ? void 0 : _a.url }) });
            }
            else {
                throw new common_1.NotFoundException("User not Found");
            }
        }));
    }
    addSchedule(data, req, res) {
        return (0, rxjs_1.from)(this.userService.addSchedule(req.user.username, data.serviceId, data.timeServe)).pipe((0, rxjs_1.map)((schedule) => {
            if (schedule) {
                return res.status(common_1.HttpStatus.OK).send({ schedule: schedule });
            }
            else {
                throw new common_1.BadRequestException();
            }
        }));
    }
    unSchedule(data, res) {
        return (0, rxjs_1.from)(this.userService.removeSchedule(data.id))
            .pipe((0, rxjs_1.map)(r => res.status(common_1.HttpStatus.OK).send()), (0, rxjs_1.catchError)((err) => {
            throw err;
        }));
    }
    doneSchedule(data, req, res) {
        return this.userService.doneServiceSchedule(req.user.username, data.serviceId).pipe((0, rxjs_1.map)((schedule) => {
            if (schedule) {
                return res.status(common_1.HttpStatus.OK).send({ schedule: schedule });
            }
            throw new common_1.BadRequestException();
        }));
    }
    getAllSchedule(res) {
        return this.userService.getAllSchedule().pipe((0, rxjs_1.map)((schedules) => {
            return res.status(common_1.HttpStatus.OK).send({
                schedules: schedules
            });
        }), (0, rxjs_1.catchError)((err) => {
            throw new common_1.BadRequestException(err);
        }));
    }
    addServiceToFavorite(req, data, res) {
        return this.userService.addToFavorite(data.serviceId).pipe((0, rxjs_1.map)((service) => {
            if (service) {
                return res.status(common_1.HttpStatus.OK).send({ serviceAdded: service });
            }
            else {
                throw new common_1.BadRequestException();
            }
        }));
    }
    removeServiceFromFavorite(req, data, res) {
        return (0, rxjs_1.from)(this.userService.removeFavorite(data.serviceId)).pipe((0, rxjs_1.map)(s => {
            return res.status(common_1.HttpStatus.OK).send();
        }), (0, rxjs_1.catchError)((e) => {
            throw e;
        }));
    }
    getFollowedService(res) {
        return this.userService.getFollowedService().pipe((0, rxjs_1.map)((services) => {
            if (services) {
                return res.status(common_1.HttpStatus.OK).send({ services: services });
            }
            else {
                throw new common_1.NotFoundException();
            }
        }));
    }
    getHistorySchedule(res) {
        return this.userService.getHistorySchedule().pipe((0, rxjs_1.map)((histories) => {
            if (histories) {
                return res.status(common_1.HttpStatus.OK).send({
                    historys: histories
                });
            }
            else {
                throw new common_1.BadRequestException();
            }
        }));
    }
    ratingService(res, data, files) {
        return (0, rxjs_1.from)(this.userService.ratingService(data.serviceId, data.score, data.title, data.content, files)).pipe((0, rxjs_1.map)((comment) => {
            if (comment) {
                return res.status(common_1.HttpStatus.OK).send({
                    comment: comment
                });
            }
        }), (0, rxjs_1.catchError)((e) => {
            throw new common_1.BadRequestException('Something wrong!');
        }));
    }
    deleteRatingService(res, data) {
        return (0, rxjs_1.from)(this.userService.deleteRating(data.id))
            .pipe((0, rxjs_1.map)(r => res.status(common_1.HttpStatus.OK).send()), (0, rxjs_1.catchError)(e => { throw e; }));
    }
    likeComment(res, data) {
        return this.userService.likeComment(data.commentId).pipe((0, rxjs_1.map)((comment) => {
            if (comment) {
                return res.status(common_1.HttpStatus.OK).send({ comment: comment });
            }
            else {
                throw new common_1.BadRequestException();
            }
        }));
    }
    uploadImage(file, res) {
        return (0, rxjs_1.from)(this.userService.uploadAvatar(file))
            .pipe((0, rxjs_1.map)(file => {
            if (file) {
                return res.status(common_1.HttpStatus.OK).send({ avatar: file });
            }
            else {
                return res.status(common_1.HttpStatus.BAD_REQUEST).send();
            }
        }));
    }
    getNotifications(res) {
        return (0, rxjs_1.from)(this.userService.getAllNotifications()).pipe((0, rxjs_1.map)((noti) => {
            return res.status(common_1.HttpStatus.OK).send({ noti: noti });
        }), (0, rxjs_1.catchError)((e) => {
            console.log(e);
            throw new common_1.BadRequestException(e);
        }));
    }
    readAllNoti(res) {
        return (0, rxjs_1.from)(this.userService.readAllNoti()).pipe((0, rxjs_1.map)(b => {
            if (b) {
                return res.status(common_1.HttpStatus.OK).send();
            }
        }), (0, rxjs_1.catchError)((e) => {
            throw new common_1.BadRequestException("Something wrong!");
        }));
    }
};
__decorate([
    (0, common_1.Post)("/register"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.UserRegisterDto, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "register", null);
__decorate([
    (0, common_1.Get)('/profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, has_role_decorator_1.HasRole)([roles_type_enum_1.RolesType.ADMIN]),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "profile", null);
__decorate([
    (0, common_1.Put)("/update-profile"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, update_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.Post)("/add-schedule"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [add_schedule_dto_1.AddScheduleDto, Object, Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "addSchedule", null);
__decorate([
    (0, common_1.Post)('unschedule'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "unSchedule", null);
__decorate([
    (0, common_1.Post)("/done-schedule"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [done_schedule_dto_1.DoneScheduleDto, Object, Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "doneSchedule", null);
__decorate([
    (0, common_1.Get)("schedules"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getAllSchedule", null);
__decorate([
    (0, common_1.Post)("/add-favorite"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, add_favorite_dto_1.AddFavoriteDto, Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "addServiceToFavorite", null);
__decorate([
    (0, common_1.Post)('/remove-favorite'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, add_favorite_dto_1.AddFavoriteDto, Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "removeServiceFromFavorite", null);
__decorate([
    (0, common_1.Get)('/followed-service'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "getFollowedService", null);
__decorate([
    (0, common_1.Get)('history-schedule'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "getHistorySchedule", null);
__decorate([
    (0, common_1.Post)('rating-service'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)("images")),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, rating_service_dto_1.RatingServiceDto, Array]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "ratingService", null);
__decorate([
    (0, common_1.Post)('delete-rating'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, delete_comment_dto_1.DeleteCommentDto]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "deleteRatingService", null);
__decorate([
    (0, common_1.Post)('like-comment'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, like_comment_dto_1.LikeCommentDto]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "likeComment", null);
__decorate([
    (0, common_1.Post)("upload-avatar"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("image")),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)("notifications"),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)("readAllNoti"),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "readAllNoti", null);
UserController = __decorate([
    (0, common_1.Controller)({ path: "user" }),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map