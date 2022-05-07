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
const lodash_1 = require("lodash");
const fs = require("fs");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
const utility_1 = require("../shared/utility");
let EnterpriseService = class EnterpriseService {
    constructor(enterpriseModel, serviceModel, bService, req, notiModel, scheduleModel, scheduleHistoryModel, userModel, commentModel, uploadService, notiSocket, configService, purchaseTempModel, purchaseModel, httpService, scoreModel) {
        this.enterpriseModel = enterpriseModel;
        this.serviceModel = serviceModel;
        this.bService = bService;
        this.req = req;
        this.notiModel = notiModel;
        this.scheduleModel = scheduleModel;
        this.scheduleHistoryModel = scheduleHistoryModel;
        this.userModel = userModel;
        this.commentModel = commentModel;
        this.uploadService = uploadService;
        this.notiSocket = notiSocket;
        this.configService = configService;
        this.purchaseTempModel = purchaseTempModel;
        this.purchaseModel = purchaseModel;
        this.httpService = httpService;
        this.scoreModel = scoreModel;
        var path = require("path");
        this.premiumConfig = JSON.parse(fs.readFileSync(path.join(__dirname, "../../res/json/premium.json"), 'utf-8'));
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
    async buyPremium(enterprise, idOffer, transactionNo) {
        try {
            let exist = await this.purchaseModel.exists({ transactionNo: transactionNo });
            if (exist) {
                return false;
            }
            const model = await this.enterpriseModel.findOne({ _id: mongoose_1.Types.ObjectId(enterprise) }).exec();
            if (!model) {
                throw new common_1.NotFoundException("Enterprise model not found!");
            }
            if (model.premium && ((0, lodash_1.parseInt)(model.premium) >= (0, lodash_1.parseInt)(idOffer))) {
                throw new common_1.ConflictException("Premium is lower than previous");
            }
            await model.update({ premium: idOffer }).exec();
            await this.updateAllRankingPointOfEnterprise(enterprise);
            await this.purchaseModel.create({ enterprise: enterprise, transactionNo: transactionNo, date: Date.now(), premium: idOffer });
            return true;
        }
        catch (e) {
            console.log(e);
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
    async getPaymentUrl(offerId) {
        const oldOffer = (await this.enterpriseModel.findOne({ _id: this.req.user.id }).exec()).premium;
        if (oldOffer && (0, lodash_1.parseInt)(oldOffer) >= (0, lodash_1.parseInt)(offerId)) {
            throw new common_1.BadRequestException("New offer is bad than previous");
        }
        console.log(offerId);
        let offer = this.premiumConfig[offerId];
        if (!offer)
            throw new common_1.NotFoundException("Offer not found");
        var tmnCode = this.configService.get('TMN_CODE');
        var secretKey = this.configService.get('HASH_SECRET');
        var vnpUrl = this.configService.get('VNP_URL');
        var returnUrl = this.configService.get("RETURN_URL");
        var moment = require("moment");
        var dateCreate = moment().format("YYYYMMDDHHmmss");
        var orderId = this.req.user.id + '_' + moment().format("YYYYMMDDHHmmss") + '_' + offerId;
        var orderInfo = "THanh toan";
        var locale = "vn";
        var currCode = 'VND';
        var vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = orderInfo;
        vnp_Params['vnp_Amount'] = offer.price * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = this.req.ip;
        vnp_Params['vnp_CreateDate'] = dateCreate;
        vnp_Params = Object.keys(vnp_Params).sort().reduce(function (result, key) {
            result[key] = vnp_Params[key];
            return result;
        }, {});
        var querystring = require('qs');
        var signData = querystring.stringify(vnp_Params, { encode: true, format: "RFC1738" });
        var crypto = require("crypto");
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: true, format: "RFC1738" });
        return vnpUrl;
    }
    async handleConfirmTransaction(amount, transactionNo, responseCode, orderId) {
        try {
            var offset = orderId.split("_");
            if (offset.length < 3)
                return;
            var clientId = offset[0];
            var offerId = offset[2];
            if (responseCode === "00") {
                let success = await this.buyPremium(clientId, offerId, transactionNo);
                this.notiSocket.sendNotificationToClient(clientId, { success: success, offerId });
            }
            else {
                this.notiSocket.sendNotificationToClient(clientId, { success: false });
            }
        }
        catch (e) {
            throw e;
        }
    }
    async handleConfirmTransactionFromClient(amount, transactionNo, responseCode, orderId) {
        try {
            if (responseCode !== "00")
                return false;
            var offset = orderId.split("_");
            if (offset.length < 3)
                return;
            var clientId = offset[0];
            var offerId = offset[2];
            let exist = await this.purchaseModel.exists({ transactionNo });
            if (exist)
                return false;
            let success = await this.buyPremium(this.req.user.id, offerId, transactionNo);
            this.notiSocket.sendNotificationToClient(this.req.user.id, { success: success, offerId });
            return success;
        }
        catch (e) {
        }
    }
    async calRankingPointService(serviceId) {
        if (!mongoose_1.Types.ObjectId.isValid(serviceId)) {
            throw new common_1.NotFoundException("Service not found");
        }
        const service = await this.serviceModel.findOne({ _id: mongoose_1.Types.ObjectId(serviceId) }).exec();
        const enterprise = await this.enterpriseModel.findOne({ _id: service.enterprise }).exec();
        const comment = await this.commentModel.find({ service: service._id }).exec();
        let promise = [];
        comment.map((cmt) => {
            promise.push(this.httpService.post('http://127.0.0.1:5001', { text: cmt.content }).toPromise());
        });
        let arrCmtScore = await Promise.all(promise);
        arrCmtScore = arrCmtScore.map(i => i.data.np);
        let sum = arrCmtScore.reduce((a, b) => (a + b), 0);
        let avg = sum / arrCmtScore.length;
        const introduce = service.introduction;
        const { convert } = require('html-to-text');
        let text = convert(introduce);
        const introduceCal = await this.httpService.post('http://127.0.0.1:5001', { text: text }).toPromise();
        let introduceScore = introduceCal.data.np;
        const scores = await this.scoreModel.find({ service: service._id }).exec();
        let ratingScore = scores.map((s) => {
            return (0, utility_1.getRatingScore)(s.scores);
        }).reduce((a, b) => (a + b), 0) / scores.length;
        let premiumId = enterprise.premium;
        let premiumScore = 0;
        if (premiumId) {
            let premium = this.premiumConfig[premiumId];
            if (premium) {
                premiumScore = premium.bonus;
            }
        }
        let totalPoint = premiumScore + (3 * ratingScore + introduceScore + 3 * avg) / 7;
        console.log("Call NP: ", serviceId, "__new Point: ", service.rankingPoint, "->", totalPoint);
        await service.update({ rankingPoint: totalPoint }).exec();
        return totalPoint;
    }
    async updateAllRankingPointOfEnterprise(enterprise) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(enterprise)) {
                throw new common_1.NotFoundException("Service not found");
            }
            let service = await this.serviceModel.find({ enterprise: enterprise }).exec();
            let promise = [];
            service && service.map(s => {
                promise.push(this.calRankingPointService(s._id));
            });
            await Promise.all(promise);
            return;
        }
        catch (e) {
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
    __param(8, (0, common_1.Inject)(database_constants_1.COMMENT_MODEL)),
    __param(12, (0, common_1.Inject)(database_constants_1.PURCHASE_TEMP_MODEL)),
    __param(13, (0, common_1.Inject)(database_constants_1.PURCHASE_MODEL)),
    __param(15, (0, common_1.Inject)(database_constants_1.SCORE_MODEL)),
    __metadata("design:paramtypes", [Object, Object, b_service_service_1.BServiceService, Object, Object, Object, Object, Object, Object, upload_service_1.FileUploadService,
        notification_gateway_1.NotificationGateway,
        config_1.ConfigService, Object, Object, axios_1.HttpService, Object])
], EnterpriseService);
exports.EnterpriseService = EnterpriseService;
//# sourceMappingURL=enterprise.service.js.map