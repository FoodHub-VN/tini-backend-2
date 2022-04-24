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
exports.BServiceController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const rxjs_1 = require("rxjs");
const b_service_service_1 = require("./b-service.service");
const enterprise_new_service_dto_1 = require("../enterprise/dto/enterprise-new-service.dto");
const AddServiceIntroduce_dto_1 = require("./dto/AddServiceIntroduce.dto");
const AddServiceOpenTime_dto_1 = require("./dto/AddServiceOpenTime.dto");
const owner_interceptor_1 = require("./owner.interceptor");
const jwt_auth_guard_1 = require("../auth/guard/jwt-auth.guard");
let BServiceController = class BServiceController {
    constructor(bSService) {
        this.bSService = bSService;
    }
    upload(file) {
    }
    modifyService(data, res, files, idService) {
        return (0, rxjs_1.from)(this.bSService.modifyService(data, idService, files)).pipe((0, rxjs_1.map)(service => {
            if (!service) {
                throw new common_1.NotFoundException(`Not Found service ${data.name}`);
            }
            else {
                return res.status(common_1.HttpStatus.OK).send({
                    service: service
                });
            }
        }));
    }
    addServiceIntroduce(data, idService, res) {
        return this.bSService.addServiceIntroduce(data, idService).pipe((0, rxjs_1.map)((intro) => {
            if (intro) {
                return res.status(common_1.HttpStatus.OK).send({ intro: intro });
            }
            else {
                throw new common_1.BadRequestException("Cannot create introduction");
            }
        }));
    }
    addServiceOpenTime(data, res, idService) {
        return this.bSService.addServiceOpenTime(data, idService).pipe((0, rxjs_1.map)((service) => {
            if (!service) {
                throw new common_1.NotFoundException("Service not found!");
            }
            else {
                return res.status(common_1.HttpStatus.OK).send({ service: service });
            }
        }));
    }
    deleteService(res, idService) {
        return this.bSService.deleteService(idService).pipe((0, rxjs_1.map)((service) => {
            if (!service) {
                throw new common_1.NotFoundException("Service not found");
            }
            return res.status(common_1.HttpStatus.OK).send({ service: service });
        }));
    }
    getAllSchedule(res, idService) {
        return this.bSService.getAllSchedule(idService).pipe((0, rxjs_1.map)((schedules) => {
            return res.status(common_1.HttpStatus.OK).send({ schedules: schedules });
        }));
    }
};
__decorate([
    (0, common_1.Post)("testUpload"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("avatar", {
        storage: (0, multer_1.diskStorage)({
            destination: "./upload",
            filename: (req, file, callback) => {
                callback(null, file.originalname);
            }
        })
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BServiceController.prototype, "upload", null);
__decorate([
    (0, common_1.Put)("modify-service"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)("images")),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __param(3, (0, common_1.Param)("idService")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [enterprise_new_service_dto_1.EnterPriseNewServiceDataDto, Object, Array, Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], BServiceController.prototype, "modifyService", null);
__decorate([
    (0, common_1.Post)("add-introduce"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)("idService")),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddServiceIntroduce_dto_1.AddServiceIntroduceDto, Object, Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], BServiceController.prototype, "addServiceIntroduce", null);
__decorate([
    (0, common_1.Post)("add-opentime"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Param)("idService")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddServiceOpenTime_dto_1.AddServiceOpenTimeDto, Object, Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], BServiceController.prototype, "addServiceOpenTime", null);
__decorate([
    (0, common_1.Post)('delete'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)("idService")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], BServiceController.prototype, "deleteService", null);
__decorate([
    (0, common_1.Get)("schedules"),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)("idService")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], BServiceController.prototype, "getAllSchedule", null);
BServiceController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtEnterpriseAuthGuard),
    (0, common_1.UseInterceptors)(owner_interceptor_1.OwnerInterceptor),
    (0, common_1.Controller)({ path: "service/:idService", scope: common_1.Scope.REQUEST }),
    __metadata("design:paramtypes", [b_service_service_1.BServiceService])
], BServiceController);
exports.BServiceController = BServiceController;
//# sourceMappingURL=b-service.controller.js.map