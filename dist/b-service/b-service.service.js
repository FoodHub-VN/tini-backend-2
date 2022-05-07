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
exports.BServiceService = void 0;
const common_1 = require("@nestjs/common");
const database_constants_1 = require("../database/database.constants");
const core_1 = require("@nestjs/core");
const rxjs_1 = require("rxjs");
const mongoose_1 = require("mongoose");
const upload_service_1 = require("../upload/upload.service");
const utility_1 = require("../shared/utility");
const enterprise_service_1 = require("../enterprise/enterprise.service");
let BServiceService = class BServiceService {
    constructor(serviceModel, introductionModel, req, scheduleModel, categoryModel, commentModel, scoreModel, uploadService, moduleRef, enterpriseService) {
        this.serviceModel = serviceModel;
        this.introductionModel = introductionModel;
        this.req = req;
        this.scheduleModel = scheduleModel;
        this.categoryModel = categoryModel;
        this.commentModel = commentModel;
        this.scoreModel = scoreModel;
        this.uploadService = uploadService;
        this.moduleRef = moduleRef;
        this.enterpriseService = enterpriseService;
    }
    async createService(data, images) {
        if (!mongoose_1.Types.ObjectId.isValid(data.category)) {
            throw new common_1.NotFoundException("Category Not found");
        }
        try {
            const serviceExist = await this.serviceModel.findOne({ name: data.name }).exec();
            if (serviceExist) {
                throw new common_1.ConflictException("Service is already existing: " + serviceExist.name);
            }
            const checkCategory = await this.categoryModel.findOne({ _id: mongoose_1.Types.ObjectId(data.category) }).exec();
            if (!checkCategory) {
                throw new common_1.ConflictException("Category not found");
            }
            if (images && images.length > 0) {
                let promises = [];
                images.map(e => {
                    promises.push(this.uploadService.upload(e));
                });
                const res = await Promise.all(promises);
                return await this.serviceModel.create(Object.assign(Object.assign({}, data), { enterprise: this.req.user.id, images: res }));
            }
            else {
                return await this.serviceModel.create(Object.assign(Object.assign({}, data), { enterprise: this.req.user.id }));
            }
        }
        catch (e) {
            throw e;
        }
    }
    async modifyService(data, serviceId, images) {
        if (!mongoose_1.Types.ObjectId.isValid(serviceId)) {
            throw new common_1.NotFoundException("Service not found");
        }
        try {
            const { removeImg } = data, __data = __rest(data, ["removeImg"]);
            let model = await this.serviceModel.findOne({ _id: mongoose_1.Types.ObjectId(serviceId) }).exec();
            if (removeImg && removeImg.length > 0) {
                const res = await this.uploadService.deleteMulti(removeImg);
                const filterImage = model.images.filter((e) => {
                    return !removeImg.includes(e.key);
                });
                await model.update({ images: filterImage }).exec();
            }
            if (images && images.length > 0) {
                const promises = [];
                images.map(image => {
                    promises.push(this.uploadService.upload(image));
                });
                const res = await Promise.all(promises);
                model = await this.serviceModel.findOne({ _id: mongoose_1.Types.ObjectId(serviceId) }).exec();
                model.images.push(...res);
                await model.save();
            }
            await this.serviceModel.findOneAndUpdate({ _id: mongoose_1.Types.ObjectId(serviceId) }, Object.assign({}, __data), { new: true }).exec();
            if (data.introduction) {
                await this.enterpriseService.calRankingPointService(serviceId);
            }
            return this.serviceModel.findOne({ _id: mongoose_1.Types.ObjectId(serviceId) }).exec();
        }
        catch (e) {
            throw e;
        }
    }
    addServiceIntroduce(data, serviceId) {
        if (!mongoose_1.Types.ObjectId.isValid(serviceId)) {
            throw new common_1.NotFoundException("Service not found!");
        }
        return (0, rxjs_1.from)(this.introductionModel.findOne({ service: mongoose_1.Types.ObjectId(serviceId) }).exec()).pipe((0, rxjs_1.mergeMap)((intro) => {
            if (!intro) {
                return (0, rxjs_1.from)(this.introductionModel.create({ service: mongoose_1.Types.ObjectId(serviceId), content: data.content }));
            }
            else {
                return (0, rxjs_1.from)(this.introductionModel.findOneAndUpdate({ service: mongoose_1.Types.ObjectId(serviceId) }, { content: data.content }, { new: true }).exec());
            }
        }), (0, rxjs_1.catchError)((err) => {
            throw new common_1.BadRequestException("Add introduce fail!");
        }));
    }
    addServiceOpenTime(data, serviceId) {
        if (!mongoose_1.Types.ObjectId.isValid(serviceId)) {
            throw new common_1.NotFoundException("Service not found!");
        }
        return (0, rxjs_1.from)(this.serviceModel.findOneAndUpdate({ _id: mongoose_1.Types.ObjectId(serviceId) }, { openTime: data.openTime, closeTime: data.closeTime }).exec());
    }
    deleteService(serviceId) {
        if (!mongoose_1.Types.ObjectId.isValid(serviceId)) {
            throw new common_1.NotFoundException("Service not found!");
        }
        return (0, rxjs_1.from)(this.serviceModel.findOne({ _id: mongoose_1.Types.ObjectId(serviceId) }).exec()).pipe((0, rxjs_1.map)(service => {
            if (!service)
                throw new common_1.NotFoundException("Service not found!");
            return service;
        }), (0, rxjs_1.mergeMap)((service) => {
            return (0, rxjs_1.from)(service.remove());
        }));
    }
    getAllSchedule(serviceId) {
        if (!mongoose_1.Types.ObjectId.isValid(serviceId)) {
            throw new common_1.NotFoundException("Service not found!");
        }
        return (0, rxjs_1.from)(this.scheduleModel.find({ service: mongoose_1.Types.ObjectId(serviceId) }).exec());
    }
    async getInfo(serviceId) {
        if (!mongoose_1.Types.ObjectId.isValid(serviceId)) {
            throw new common_1.NotFoundException("Service not found!");
        }
        const service = await this.serviceModel.findOne({ _id: mongoose_1.Types.ObjectId(serviceId) }).populate("enterprise", "-password").exec();
        return service;
    }
    async getComment(serviceId) {
        if (!mongoose_1.Types.ObjectId.isValid(serviceId)) {
            throw new common_1.NotFoundException("Service not found!");
        }
        const comment = await this.commentModel.find({ service: serviceId }).populate(["user", "service"]).exec();
        return comment;
    }
    async getServiceScore(serviceId) {
        if (!mongoose_1.Types.ObjectId.isValid(serviceId)) {
            throw new common_1.NotFoundException("Service not found!");
        }
        const defaultScore = [7, 7, 7, 7, 7,];
        try {
            const scores = await this.scoreModel.find({ service: serviceId }).exec();
            if (scores.length <= 0) {
                return [...defaultScore, (0, utility_1.getRatingScore)(defaultScore)];
            }
            const leanScore = scores.map(s => s.scores);
            let resScore = [0, 0, 0, 0, 0];
            leanScore.forEach((e) => {
                resScore[0] = resScore[0] + e[0];
                resScore[1] = resScore[1] + e[1];
                resScore[2] = resScore[2] + e[2];
                resScore[3] = resScore[3] + e[3];
                resScore[4] = resScore[4] + e[4];
            });
            resScore.forEach((e, i) => { resScore[i] = resScore[i] / leanScore.length; });
            return [...resScore, (0, utility_1.getRatingScore)(resScore)];
        }
        catch (e) {
            console.log(e);
            return [...defaultScore, (0, utility_1.getRatingScore)(defaultScore)];
        }
    }
};
BServiceService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(database_constants_1.SERVICE_MODEL)),
    __param(1, (0, common_1.Inject)(database_constants_1.INTRODUCTION_MODEL)),
    __param(2, (0, common_1.Inject)(core_1.REQUEST)),
    __param(3, (0, common_1.Inject)(database_constants_1.SCHEDULE_MODEL)),
    __param(4, (0, common_1.Inject)(database_constants_1.CATEGORY_MODEL)),
    __param(5, (0, common_1.Inject)(database_constants_1.COMMENT_MODEL)),
    __param(6, (0, common_1.Inject)(database_constants_1.SCORE_MODEL)),
    __param(9, (0, common_1.Inject)((0, common_1.forwardRef)(() => enterprise_service_1.EnterpriseService))),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, upload_service_1.FileUploadService,
        core_1.ModuleRef,
        enterprise_service_1.EnterpriseService])
], BServiceService);
exports.BServiceService = BServiceService;
//# sourceMappingURL=b-service.service.js.map