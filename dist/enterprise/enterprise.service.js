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
exports.EnterpriseService = void 0;
const common_1 = require("@nestjs/common");
const database_constants_1 = require("../database/database.constants");
const rxjs_1 = require("rxjs");
const core_1 = require("@nestjs/core");
const b_service_service_1 = require("../b-service/b-service.service");
const mongoose_1 = require("mongoose");
const notification_gateway_1 = require("../notification/notification.gateway");
const NotiType_type_1 = require("../shared/NotiType.type");
const upload_service_1 = require("../upload/upload.service");
let EnterpriseService = class EnterpriseService {
    constructor(enterpriseModel, serviceModel, bService, req, notiModel, scheduleModel, scheduleHistoryModel, userModel, uploadService, notiSocket) {
        this.enterpriseModel = enterpriseModel;
        this.serviceModel = serviceModel;
        this.bService = bService;
        this.req = req;
        this.notiModel = notiModel;
        this.scheduleModel = scheduleModel;
        this.scheduleHistoryModel = scheduleHistoryModel;
        this.userModel = userModel;
        this.uploadService = uploadService;
        this.notiSocket = notiSocket;
    }
    findEnterpriseByName(name) {
        return (0, rxjs_1.from)(this.enterpriseModel.findOne({ username: name }).exec());
    }
    findEnterpriseWithPassByName(name) {
        return (0, rxjs_1.from)(this.enterpriseModel.findOne({ username: name }).select("+password").exec());
    }
    existEnterpriseByName(name) {
        return (0, rxjs_1.from)(this.enterpriseModel.exists({ username: name }));
    }
    existEnterpriseByMail(mail) {
        return (0, rxjs_1.from)(this.enterpriseModel.exists({ email: mail }));
    }
    register(data) {
        return (0, rxjs_1.from)(this.enterpriseModel.create(Object.assign({}, data)));
    }
    createNewService(data, images) {
        return (0, rxjs_1.from)(this.bService.createService(data, images));
    }
    getInfo() {
        return (0, rxjs_1.from)(this.enterpriseModel.findOne({ _id: this.req.user.id }, null, { lean: true }).exec());
    }
    getAllService() {
        return (0, rxjs_1.from)(this.serviceModel.find({ enterprise: this.req.user.id }).populate("category").exec());
    }
    async getAllNotifications() {
        try {
            const service = await this.serviceModel.find({ enterprise: this.req.user.id }).exec();
            const notiModel = await this.notiModel.find({ service: { $in: service.map(s => s._id) } }, null, { lean: true })
                .populate(["service", "user"])
                .exec();
            return notiModel;
        }
        catch (e) {
            throw e;
        }
    }
    async readNoti(notiId) {
        if (!mongoose_1.Types.ObjectId.isValid(notiId)) {
            throw new common_1.NotFoundException("Notification not found!");
        }
        try {
            const notiModel = await this.notiModel.findOne({ _id: notiId }).populate("service").exec();
            if (!notiModel || notiModel.service.enterprise != this.req.user.id) {
                throw new common_1.NotFoundException("Notification not found!");
            }
            await notiModel.updateOne({ hadRead: true }).exec();
            return true;
        }
        catch (e) {
            throw e;
        }
    }
    async readAllNoti() {
        try {
            const services = await this.serviceModel.find({ enterprise: this.req.user.id }).exec();
            await this.notiModel.updateMany({ service: { $in: services.map(s => s._id) } }, { hadRead: true }).exec();
            return true;
        }
        catch (e) {
            throw e;
        }
    }
    async buyPremium(id) {
        try {
            const model = await this.enterpriseModel.findOne({ _id: this.req.user.id }).exec();
            if (parseInt(model.premium) >= parseInt(id)) {
                throw new common_1.ConflictException("Premium is lower than previous");
            }
            await model.update({ premium: id }).exec();
            return true;
        }
        catch (e) {
            throw e;
        }
    }
    async getSchedules() {
        try {
            const services = await this.serviceModel.find({ enterprise: this.req.user.id }).exec();
            const schedule = await this.scheduleModel.find({ service: { $in: services.map(s => s.id) } }).populate(["user", "service"]).exec();
            return schedule;
        }
        catch (e) {
            throw e;
        }
    }
    async deleteSchedule(id) {
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException("Schedule not found!");
        }
        try {
            const schedule = await this.scheduleModel.findOne({ _id: id }).exec();
            if (!schedule)
                throw new common_1.NotFoundException("Schedule not found!");
            const newNoti = await this.notiModel.create({
                user: schedule.user,
                service: schedule.service,
                hadRead: false,
                type: NotiType_type_1.NotiType.ENTERPRISE_DELETE_SCHEDULE,
                date: Date.now()
            });
            const newNotiDetail = await newNoti.populate([{ path: "user" }, { path: "service" }]).execPopulate();
            this.notiSocket.sendNotificationToClient(this.req.user.id, newNotiDetail);
            this.notiSocket.sendNotificationToClient(schedule.user.toString(), newNotiDetail);
            await schedule.remove();
            return true;
        }
        catch (e) {
            throw e;
        }
    }
    async doneSchedule(id) {
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException("Schedule not found!");
        }
        try {
            const schedule = await this.scheduleModel.findOne({ _id: id }).exec();
            if (!schedule)
                throw new common_1.NotFoundException("Schedule not found!");
            const newNoti = await this.notiModel.create({
                user: schedule.user,
                service: schedule.service,
                hadRead: false,
                type: NotiType_type_1.NotiType.ENTERPRISE_DONE_SCHEDULE,
                date: Date.now()
            });
            const newNotiDetail = await newNoti.populate([{ path: "user" }, { path: "service" }]).execPopulate();
            this.notiSocket.sendNotificationToClient(this.req.user.id, newNotiDetail);
            this.notiSocket.sendNotificationToClient(schedule.user.toString(), newNotiDetail);
            await schedule.remove();
            await this.scheduleHistoryModel.create({
                user: schedule.user,
                service: schedule.service,
                date: Date.now(),
                hasRating: false
            });
            return true;
        }
        catch (e) {
            throw e;
        }
    }
    uploadAvatar(file) {
        return (0, rxjs_1.from)(this.enterpriseModel.findOne({ _id: this.req.user.id }).exec())
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
            console.log(err);
            throw new common_1.BadRequestException({ err });
        }));
    }
    async updateProfile(data) {
        try {
            const model = await this.enterpriseModel.findOne({ _id: this.req.user.id }).exec();
            if (model) {
                await model.update(Object.assign({}, data)).exec();
                return model;
            }
            else {
                throw new common_1.NotFoundException("Enterprise not found!");
            }
        }
        catch (e) {
            throw e;
        }
    }
    async getOverviewAnalysis() {
        try {
            const service = await this.serviceModel.find({ enterprise: this.req.user.id }).exec();
            const numOfFollow = await this.userModel.aggregate([{
                    $unwind: "$followedService"
                }, {
                    $match: {
                        followedService: { $in: service.map(e => e._id) }
                    }
                }]).exec();
            const numOfDoneSchedule = await this.scheduleHistoryModel.count({ service: { $in: service.map(e => e._id) } });
            return { numOfService: service.length, numOfFollow: numOfFollow.length, numOfDoneSchedule: numOfDoneSchedule };
        }
        catch (e) {
            throw e;
        }
    }
};
EnterpriseService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(database_constants_1.ENTERPRISE_MODEL)),
    __param(1, (0, common_1.Inject)(database_constants_1.SERVICE_MODEL)),
    __param(2, (0, common_1.Inject)(b_service_service_1.BServiceService)),
    __param(3, (0, common_1.Inject)(core_1.REQUEST)),
    __param(4, (0, common_1.Inject)(database_constants_1.NOTIFICATION_MODEL)),
    __param(5, (0, common_1.Inject)(database_constants_1.SCHEDULE_MODEL)),
    __param(6, (0, common_1.Inject)(database_constants_1.SCHEDULE_HISTORY_MODEL)),
    __param(7, (0, common_1.Inject)(database_constants_1.USER_MODEL)),
    __metadata("design:paramtypes", [Object, Object, b_service_service_1.BServiceService, Object, Object, Object, Object, Object, upload_service_1.FileUploadService,
        notification_gateway_1.NotificationGateway])
], EnterpriseService);
exports.EnterpriseService = EnterpriseService;
//# sourceMappingURL=enterprise.service.js.map