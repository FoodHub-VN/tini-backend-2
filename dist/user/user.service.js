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
const rxjs_1 = require("rxjs");
const mongoose_1 = require("mongoose");
const core_1 = require("@nestjs/core");
const utility_1 = require("../shared/utility");
const upload_service_1 = require("../upload/upload.service");
const NotiType_type_1 = require("../shared/NotiType.type");
const notification_gateway_1 = require("../notification/notification.gateway");
const enterprise_service_1 = require("../enterprise/enterprise.service");
let UserService = class UserService {
    constructor(userModel, scheduleModel, serviceModel, scheduleHistory, req, commentModel, notiModel, scoreModel, uploadService, notiSocket, enterpriseService) {
        this.userModel = userModel;
        this.scheduleModel = scheduleModel;
        this.serviceModel = serviceModel;
        this.scheduleHistory = scheduleHistory;
        this.req = req;
        this.commentModel = commentModel;
        this.notiModel = notiModel;
        this.scoreModel = scoreModel;
        this.uploadService = uploadService;
        this.notiSocket = notiSocket;
        this.enterpriseService = enterpriseService;
    }
    findUserWithPassByName(username, lean = false) {
        return (0, rxjs_1.from)(this.userModel.findOne({ username }, null, { lean }).select("+password").exec());
    }
    findUserByName(username, lean = false) {
        return (0, rxjs_1.from)(this.userModel.findOne({ username }, null, { lean }).exec());
    }
    async findUserById(userId) {
        return await this.userModel.findOne({ _id: userId }, null, { lean: true }).exec();
    }
    register(data) {
        return (0, rxjs_1.from)(this.userModel.create(Object.assign({}, data)));
    }
    existByUsername(username) {
        return (0, rxjs_1.from)(this.userModel.exists({ username }));
    }
    existByMail(email) {
        return (0, rxjs_1.from)(this.userModel.exists({ email }));
    }
    updateProfile(username, data) {
        return (0, rxjs_1.from)(this.userModel.findOneAndUpdate({ username: username }, Object.assign({}, data), { new: true, lean: true }).exec()).pipe((0, rxjs_1.mergeMap)((p) => (p ? (0, rxjs_1.of)(p) : rxjs_1.EMPTY)), (0, rxjs_1.throwIfEmpty)(() => new common_1.NotFoundException(`username: ${username} is not found!`)));
    }
    doneServiceSchedule(username, serviceId) {
        return this.findUserByName(username).pipe((0, rxjs_1.mergeMap)((user) => {
            if (!user) {
                throw new common_1.NotFoundException("User not found!");
            }
            else {
                if (!mongoose_1.Types.ObjectId.isValid(serviceId)) {
                    throw new common_1.NotFoundException("Service not found!");
                }
                return (0, rxjs_1.from)(this.scheduleModel.findOne({ service: serviceId, user: user._id }).exec()).pipe((0, rxjs_1.map)((schedule) => {
                    if (!schedule) {
                        throw new common_1.NotFoundException("Schedule List not found this service!");
                    }
                    return schedule;
                }), (0, rxjs_1.mergeMap)((schedule) => {
                    return (0, rxjs_1.from)(this.scheduleHistory.create({
                        user: user._id,
                        service: mongoose_1.Types.ObjectId(serviceId),
                        date: Date.now(),
                        hasRating: false
                    })).pipe((0, rxjs_1.mergeMap)((h) => {
                        return (0, rxjs_1.from)(schedule.remove());
                    }));
                }));
            }
        }));
    }
    addSchedule(username, serviceId, time) {
        return this.findUserByName(username).pipe((0, rxjs_1.mergeMap)((user) => {
            if (!user) {
                throw new common_1.NotFoundException("User not found!");
            }
            else {
                if (!mongoose_1.Types.ObjectId.isValid(serviceId)) {
                    throw new common_1.NotFoundException("Service not found!");
                }
                return (0, rxjs_1.from)(this.serviceModel.findOne({ _id: mongoose_1.Types.ObjectId(serviceId) }).exec()).pipe((0, rxjs_1.mergeMap)((service) => {
                    if (!service) {
                        throw new common_1.NotFoundException("Service not found");
                    }
                    else {
                        return (0, rxjs_1.from)(this.scheduleModel.findOne({ service: mongoose_1.Types.ObjectId(serviceId), user: user._id })).pipe((0, rxjs_1.mergeMap)((schedule) => {
                            return (0, rxjs_1.from)(this.scheduleModel.create({
                                user: user._id,
                                service: mongoose_1.Types.ObjectId(serviceId),
                                timeServe: time
                            }));
                        }));
                    }
                }));
            }
        }));
    }
    async removeSchedule(scheduleId) {
        if (!mongoose_1.Types.ObjectId.isValid(scheduleId)) {
            throw new common_1.NotFoundException("Schedule not found!");
        }
        try {
            const schedule = await this.scheduleModel.findOne({ _id: mongoose_1.Types.ObjectId(scheduleId) }).exec();
            if (!schedule)
                throw new common_1.ConflictException("Schedule not found!");
            await schedule.remove();
            return true;
        }
        catch (e) {
            throw e;
        }
    }
    getAllSchedule() {
        return (0, rxjs_1.from)(this.scheduleModel.find({ user: mongoose_1.Types.ObjectId(this.req.user.id) }).populate(["service", "user"]).exec());
    }
    addToFavorite(serviceId) {
        if (!mongoose_1.Types.ObjectId.isValid(serviceId)) {
            throw new common_1.NotFoundException("Service not Found");
        }
        return (0, rxjs_1.from)(this.userModel.findOne({ _id: mongoose_1.Types.ObjectId(this.req.user.id) }).exec()).pipe((0, rxjs_1.mergeMap)((user) => {
            if (user) {
                if (user.followedService.includes(serviceId)) {
                    throw new common_1.ConflictException("This service has already been added to favorite!");
                }
                else {
                    return (0, rxjs_1.from)(this.serviceModel.findOne({ _id: mongoose_1.Types.ObjectId(serviceId) }).exec()).pipe((0, rxjs_1.mergeMap)((service) => {
                        if (!service) {
                            throw new common_1.NotFoundException("Service not found!");
                        }
                        else {
                            return (0, rxjs_1.from)(user.update({ followedService: [...user.followedService, serviceId] }).exec()).pipe((0, rxjs_1.mergeMap)((u) => {
                                if (u) {
                                    let noti = {
                                        user: user._id,
                                        service: service._id,
                                        hadRead: false,
                                        type: NotiType_type_1.NotiType.FOLLOWED,
                                        date: Date.now()
                                    };
                                    return (0, rxjs_1.from)(this.notiModel.create(noti)).pipe((0, rxjs_1.mergeMap)(n => {
                                        return (0, rxjs_1.from)(n.populate([{ path: "user" }, { path: "service" }]).execPopulate())
                                            .pipe((0, rxjs_1.map)(d => {
                                            this.notiSocket.sendNotificationToClient(service.enterprise, d);
                                            this.notiSocket.sendNotificationToClient(user._id, d);
                                            return service;
                                        }));
                                    }));
                                }
                                else {
                                    throw new common_1.NotFoundException();
                                }
                            }));
                        }
                    }));
                }
            }
            else {
                throw new common_1.NotFoundException();
            }
        }));
    }
    async removeFavorite(serviceId) {
        if (!mongoose_1.Types.ObjectId.isValid(serviceId)) {
            throw new common_1.NotFoundException("Service not Found");
        }
        try {
            const model = await this.userModel.findOne({ _id: mongoose_1.Types.ObjectId(this.req.user.id) }).exec();
            if (!model)
                throw new common_1.NotFoundException();
            if (!model.followedService.includes(serviceId)) {
                throw new common_1.ConflictException("This service hasn't been added to favorite!");
            }
            const serviceModel = await this.serviceModel.findOne({ _id: mongoose_1.Types.ObjectId(serviceId) }).exec();
            if (!serviceModel)
                throw new common_1.NotFoundException("Service not found!");
            const newNoti = await this.notiModel.create({
                user: model._id,
                service: serviceModel._id,
                hadRead: false,
                type: NotiType_type_1.NotiType.UNFOLLOWED,
                date: Date.now()
            });
            const newNotiDetail = await newNoti.populate([{ path: "user" }, { path: "service" }]).execPopulate();
            this.notiSocket.sendNotificationToClient(serviceModel.enterprise, newNotiDetail);
            this.notiSocket.sendNotificationToClient(model._id, newNotiDetail);
            return model.updateOne({ followedService: model.followedService.filter((v) => v != serviceId) }, { new: true }).exec();
        }
        catch (e) {
            throw e;
        }
    }
    getFollowedService() {
        return (0, rxjs_1.from)(this.userModel.findOne({
            _id: mongoose_1.Types.ObjectId(this.req.user.id)
        }).populate("followedService").exec()).pipe((0, rxjs_1.map)((user) => {
            if (user) {
                return user.followedService;
            }
            else {
                throw new common_1.NotFoundException("User not found!");
            }
        }));
    }
    getHistorySchedule() {
        return (0, rxjs_1.from)(this.scheduleHistory.find({ user: mongoose_1.Types.ObjectId(this.req.user.id) }).populate(["service", "user"]).exec());
    }
    async ratingService(serviceId, score, title, content, images) {
        if (!mongoose_1.Types.ObjectId(serviceId)) {
            throw new common_1.NotFoundException("Service not found");
        }
        try {
            let ratingScore = (0, utility_1.getRatingScore)(score);
            var uploads;
            const service = await this.serviceModel.findOne({ _id: mongoose_1.Types.ObjectId(serviceId) }).exec();
            if (images && images.length > 0) {
                const promises = [];
                images.map(i => {
                    promises.push(this.uploadService.upload(i));
                });
                uploads = await Promise.all(promises);
                await service.update({ imgCmtCount: service.imgCmtCount ? service.imgCmtCount + images.length : 1 }).exec();
            }
            await service.update({ textCmtCount: service.textCmtCount ? service.textCmtCount + 1 : 1 }).exec();
            const comment = await this.commentModel.create({
                user: this.req.user.id,
                service: mongoose_1.Types.ObjectId(serviceId),
                rating: ratingScore,
                title: title,
                content: content,
                images: uploads
            });
            await this.scoreModel.create({
                service: mongoose_1.Types.ObjectId(serviceId),
                userRate: this.req.user.id,
                scores: score,
                commentId: comment._id
            });
            await this.enterpriseService.calRankingPointService(serviceId);
            return comment;
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }
    async deleteRating(id) {
        try {
            if (!mongoose_1.Types.ObjectId(id)) {
                throw new common_1.NotFoundException("Comment not found");
            }
            const comment = await this.commentModel.findOne({ _id: mongoose_1.Types.ObjectId(id) }).exec();
            if (!comment || comment.user != this.req.user.id) {
                throw new common_1.NotFoundException("Comment not found");
            }
            const service = await this.serviceModel.findOne({ _id: comment.service }).exec();
            let imgCount = comment.images && comment.images.length > 0 ? 1 : 0;
            await service.update({
                imgCmtCount: service.imgCmtCount ? service.imgCmtCount - imgCount : 0,
                textCmtCount: service.textCmtCount ? service.textCmtCount - 1 : 0
            }).exec();
            comment.images && comment.images.length > 0 && this.uploadService.deleteMulti(comment.images.map(i => i.key));
            await this.scoreModel.remove({ commentId: comment._id });
            await comment.remove();
            await this.enterpriseService.calRankingPointService(service._id);
            return true;
        }
        catch (e) {
            throw e;
        }
    }
    likeComment(commentId) {
        if (!mongoose_1.Types.ObjectId.isValid(commentId)) {
            throw new common_1.NotFoundException("Comment not found");
        }
        let id = mongoose_1.Types.ObjectId(commentId);
        return (0, rxjs_1.from)(this.commentModel.findOne({ _id: id }).exec()).pipe((0, rxjs_1.mergeMap)((comment) => {
            if (!comment) {
                throw new common_1.NotFoundException("Comment not found");
            }
            else {
                if (comment.userLiked.includes(this.req.user.id)) {
                    let newUserLiked = comment.userLiked.filter((v) => v != this.req.user.id);
                    return (0, rxjs_1.from)(comment.update({
                        userLiked: newUserLiked,
                        numOfLike: newUserLiked.length
                    }, { new: true }).exec());
                }
                else {
                    return (0, rxjs_1.from)(comment.update({
                        userLiked: [...comment.userLiked, this.req.user.id],
                        numOfLike: comment.userLiked.length + 1
                    }).exec());
                }
            }
        }));
    }
    uploadAvatar(file) {
        return (0, rxjs_1.from)(this.userModel.findOne({ _id: this.req.user.id }).exec())
            .pipe((0, rxjs_1.mergeMap)((user) => {
            if (user) {
                if (user.avatar) {
                    return (0, rxjs_1.from)(this.uploadService.delete(user.avatar.key))
                        .pipe((0, rxjs_1.mergeMap)((deleted) => {
                        return (0, rxjs_1.from)(this.uploadService.upload(file))
                            .pipe((0, rxjs_1.mergeMap)((fileUploaded) => {
                            return (0, rxjs_1.from)(user.updateOne({ avatar: fileUploaded }, { new: true }).exec())
                                .pipe((0, rxjs_1.map)(updated => {
                                if (updated.ok == 1) {
                                    return fileUploaded;
                                }
                                throw new common_1.BadRequestException("Something wrong!");
                            }));
                        }));
                    }));
                }
                else {
                    return (0, rxjs_1.from)(this.uploadService.upload(file))
                        .pipe((0, rxjs_1.mergeMap)((fileUploaded) => {
                        return (0, rxjs_1.from)(user.updateOne({ avatar: fileUploaded }, { new: true }).exec())
                            .pipe((0, rxjs_1.map)(updated => {
                            if (updated.ok == 1) {
                                return fileUploaded;
                            }
                            throw new common_1.BadRequestException("Something wrong!");
                        }));
                    }));
                }
            }
            else {
                (0, rxjs_1.throwError)(() => new Error());
            }
        }), (0, rxjs_1.catchError)((err, cau) => {
            throw new common_1.BadRequestException({ err });
        }));
    }
    deleteAvatar(file) {
        return (0, rxjs_1.from)(this.userModel.findOne({ _id: this.req.user.id }).exec())
            .pipe((0, rxjs_1.mergeMap)((user) => {
            if (user) {
                return (0, rxjs_1.from)(this.uploadService.delete(user.avatar.key))
                    .pipe((0, rxjs_1.map)((b) => {
                    return b;
                }));
            }
            else {
                throw new common_1.NotFoundException("User does not exist!");
            }
        }));
    }
    async getAllNotifications() {
        try {
            const notiModel = await this.notiModel.find({ user: this.req.user.id }, null, { lean: true })
                .populate(["service", "user"])
                .exec();
            return notiModel;
        }
        catch (e) {
            throw e;
        }
    }
    async readAllNoti() {
        try {
            await this.notiModel.updateMany({ user: this.req.user.id }, { hadRead: true }).exec();
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
    __param(1, (0, common_1.Inject)(database_constants_1.SCHEDULE_MODEL)),
    __param(2, (0, common_1.Inject)(database_constants_1.SERVICE_MODEL)),
    __param(3, (0, common_1.Inject)(database_constants_1.SCHEDULE_HISTORY_MODEL)),
    __param(4, (0, common_1.Inject)(core_1.REQUEST)),
    __param(5, (0, common_1.Inject)(database_constants_1.COMMENT_MODEL)),
    __param(6, (0, common_1.Inject)(database_constants_1.NOTIFICATION_MODEL)),
    __param(7, (0, common_1.Inject)(database_constants_1.SCORE_MODEL)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, upload_service_1.FileUploadService,
        notification_gateway_1.NotificationGateway,
        enterprise_service_1.EnterpriseService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map