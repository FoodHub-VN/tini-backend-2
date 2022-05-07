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
exports.EnterpriseController = void 0;
const common_1 = require("@nestjs/common");
const enterprise_service_1 = require("./enterprise.service");
const rxjs_1 = require("rxjs");
const enterprise_register_dto_1 = require("./dto/enterprise-register.dto");
const enterprise_new_service_dto_1 = require("./dto/enterprise-new-service.dto");
const jwt_auth_guard_1 = require("../auth/guard/jwt-auth.guard");
const public_guard_decorator_1 = require("../auth/guard/public.guard.decorator");
const core_1 = require("@nestjs/core");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const api_implicit_file_decorator_1 = require("@nestjs/swagger/dist/decorators/api-implicit-file.decorator");
const read_noti_dto_1 = require("./dto/read-noti.dto");
const delete_schedule_dto_1 = require("./dto/delete-schedule.dto");
const done_schedule_dto_1 = require("./dto/done-schedule.dto");
const enterprise_edit_dto_1 = require("./dto/enterprise-edit.dto");
const payment_url_dto_1 = require("./dto/payment-url.dto");
const config_1 = require("@nestjs/config");
let EnterpriseController = class EnterpriseController {
    constructor(enterpriseService, req, configService) {
        this.enterpriseService = enterpriseService;
        this.configService = configService;
    }
    register(data, res) {
        const { username, email } = data;
        return this.enterpriseService.existEnterpriseByName(username).pipe((0, rxjs_1.mergeMap)(b => {
            if (b) {
                throw new common_1.ConflictException(`Enterprise ${username} already exists!`);
            }
            else {
                return this.enterpriseService.existEnterpriseByMail(email).pipe((0, rxjs_1.mergeMap)((isEmailExist) => {
                    if (isEmailExist) {
                        throw new common_1.ConflictException(`Email: ${email} is exist!`);
                    }
                    else {
                        return this.enterpriseService.register(data)
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
    newService(data, res, files) {
        return this.enterpriseService.createNewService(data, files).pipe((0, rxjs_1.map)(service => {
            return res.status(common_1.HttpStatus.OK).send({ service: service });
        }), (0, rxjs_1.catchError)((err) => {
            throw err;
        }));
    }
    getInfo(res) {
        return this.enterpriseService.getInfo().pipe((0, rxjs_1.map)((e) => {
            if (!e) {
                throw new common_1.NotFoundException("Enterprise not found");
            }
            else {
                const { password } = e, data = __rest(e, ["password"]);
                return res.status(common_1.HttpStatus.OK).send({ enterprise: data });
            }
        }));
    }
    getAllService(res) {
        return this.enterpriseService.getAllService().pipe((0, rxjs_1.map)((services) => {
            if (!services) {
                throw new common_1.NotFoundException();
            }
            else {
                return res.status(common_1.HttpStatus.OK).send({ services: services });
            }
        }));
    }
    getNotifications(res) {
        return (0, rxjs_1.from)(this.enterpriseService.getAllNotifications()).pipe((0, rxjs_1.map)((noti) => {
            return res.status(common_1.HttpStatus.OK).send({ noti: noti });
        }), (0, rxjs_1.catchError)((e) => {
            throw new common_1.BadRequestException(e);
        }));
    }
    readNoti(res, data) {
        return (0, rxjs_1.from)(this.enterpriseService.readNoti(data.notiId)).pipe((0, rxjs_1.map)(r => {
            if (r) {
                return res.status(common_1.HttpStatus.OK).send();
            }
        }));
    }
    readAllNoti(res) {
        return (0, rxjs_1.from)(this.enterpriseService.readAllNoti()).pipe((0, rxjs_1.map)(b => {
            if (b) {
                return res.status(common_1.HttpStatus.OK).send();
            }
        }), (0, rxjs_1.catchError)((e) => {
            throw new common_1.BadRequestException("Something wrong!");
        }));
    }
    getSchedules(res) {
        return (0, rxjs_1.from)(this.enterpriseService.getSchedules())
            .pipe((0, rxjs_1.map)(s => res.status(common_1.HttpStatus.OK).send({ schedules: s })), (0, rxjs_1.catchError)((e) => {
            throw e;
        }));
    }
    deleteSchedule(res, data) {
        return (0, rxjs_1.from)(this.enterpriseService.deleteSchedule(data.id)).pipe((0, rxjs_1.map)(r => {
            return res.status(common_1.HttpStatus.OK).send();
        }), (0, rxjs_1.catchError)(e => {
            throw e;
        }));
    }
    doneSchedule(res, data) {
        return (0, rxjs_1.from)(this.enterpriseService.doneSchedule(data.id)).pipe((0, rxjs_1.map)(r => {
            return res.status(common_1.HttpStatus.OK).send();
        }), (0, rxjs_1.catchError)(e => {
            throw e;
        }));
    }
    uploadImage(file, res) {
        return (0, rxjs_1.from)(this.enterpriseService.uploadAvatar(file))
            .pipe((0, rxjs_1.map)(file => {
            if (file) {
                return res.status(common_1.HttpStatus.OK).send({ avatar: file });
            }
            else {
                return res.status(common_1.HttpStatus.BAD_REQUEST).send();
            }
        }));
    }
    updateProfile(res, data) {
        return (0, rxjs_1.from)(this.enterpriseService.updateProfile(data))
            .pipe((0, rxjs_1.map)(r => res.status(common_1.HttpStatus.OK).send(r)), (0, rxjs_1.catchError)((e) => {
            throw e;
        }));
    }
    getOverviewAnalysis(res) {
        return (0, rxjs_1.from)(this.enterpriseService.getOverviewAnalysis())
            .pipe((0, rxjs_1.map)(r => res.status(common_1.HttpStatus.OK).send(r)));
    }
    getPaymentUrl(req, ip, res, data) {
        return (0, rxjs_1.from)(this.enterpriseService.getPaymentUrl(data.idOffer))
            .pipe((0, rxjs_1.map)(r => res.status(common_1.HttpStatus.OK).send({ url: r })), (0, rxjs_1.catchError)((e) => {
            throw e;
        }));
    }
    confirmPayment(amount, transactionNo, responseCode, orderId, req, res) {
        console.log("Transaction", amount, transactionNo, responseCode, orderId);
        var vnp_Params = req.query;
        var secureHash = vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];
        vnp_Params = Object.keys(vnp_Params).sort().reduce(function (result, key) {
            result[key] = vnp_Params[key];
            return result;
        }, {});
        var secretKey = this.configService.get('HASH_SECRET');
        var querystring = require('qs');
        var signData = querystring.stringify(vnp_Params, { encode: true, format: "RFC1738" });
        var crypto = require("crypto");
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
        if (secureHash === signed) {
            res.status(200).json({ RspCode: "00", Message: "success" });
        }
        else {
            res.status(200).json({ RspCode: "97", Message: "Fail checksum" });
        }
        this.enterpriseService.handleConfirmTransaction(amount, transactionNo, responseCode, orderId);
    }
    async handleConfirmTransactionFromClient(res, data) {
        try {
            let vnp_Params = data.data;
            var secureHash = vnp_Params["vnp_SecureHash"];
            delete vnp_Params["vnp_SecureHash"];
            delete vnp_Params["vnp_SecureHashType"];
            vnp_Params = Object.keys(vnp_Params).sort().reduce(function (result, key) {
                result[key] = vnp_Params[key];
                return result;
            }, {});
            var secretKey = this.configService.get("HASH_SECRET");
            var querystring = require("qs");
            var signData = querystring.stringify(vnp_Params, { encode: true, format: "RFC1738" });
            var crypto = require("crypto");
            var hmac = crypto.createHmac("sha512", secretKey);
            var signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
            console.log(secureHash, signed);
            if (secureHash === signed) {
                let vnp_Amount = vnp_Params["vnp_Amount"];
                let vnp_TransactionNo = vnp_Params["vnp_TransactionNo"];
                let vnp_ResponseCode = vnp_Params["vnp_ResponseCode"];
                let orderID = vnp_Params["vnp_TxnRef"];
                let success = await this.enterpriseService.handleConfirmTransactionFromClient(vnp_Amount, vnp_TransactionNo, vnp_ResponseCode, orderID);
                res.status(success ? common_1.HttpStatus.OK : common_1.HttpStatus.BAD_REQUEST).send();
            }
            else {
                res.status(common_1.HttpStatus.BAD_REQUEST).send();
            }
        }
        catch (e) {
            throw new common_1.BadRequestException();
        }
    }
    test(data) {
        this.enterpriseService.calRankingPointService(data.id);
        return true;
    }
};
__decorate([
    (0, public_guard_decorator_1.Public)(),
    (0, common_1.Post)("/register"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [enterprise_register_dto_1.EnterpriseRegisterDto, Object]),
    __metadata("design:returntype", void 0)
], EnterpriseController.prototype, "register", null);
__decorate([
    (0, common_1.Post)("/new-service"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)("images")),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: "New service from enterprise",
        type: enterprise_new_service_dto_1.EnterPriseNewServiceDataDto
    }),
    (0, api_implicit_file_decorator_1.ApiImplicitFile)({
        name: 'avatar',
        required: true,
        description: 'Avatar of service',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [enterprise_new_service_dto_1.EnterPriseNewServiceDataDto, Object, Array]),
    __metadata("design:returntype", rxjs_1.Observable)
], EnterpriseController.prototype, "newService", null);
__decorate([
    (0, common_1.Get)(""),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], EnterpriseController.prototype, "getInfo", null);
__decorate([
    (0, common_1.Get)("all-services"),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], EnterpriseController.prototype, "getAllService", null);
__decorate([
    (0, common_1.Get)("notifications"),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], EnterpriseController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Post)("readNoti"),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, read_noti_dto_1.ReadNotiDto]),
    __metadata("design:returntype", rxjs_1.Observable)
], EnterpriseController.prototype, "readNoti", null);
__decorate([
    (0, common_1.Post)("readAllNoti"),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], EnterpriseController.prototype, "readAllNoti", null);
__decorate([
    (0, common_1.Get)('allSchedule'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], EnterpriseController.prototype, "getSchedules", null);
__decorate([
    (0, common_1.Post)('deleteSchedule'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, delete_schedule_dto_1.DeleteScheduleDto]),
    __metadata("design:returntype", rxjs_1.Observable)
], EnterpriseController.prototype, "deleteSchedule", null);
__decorate([
    (0, common_1.Post)('doneSchedule'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, done_schedule_dto_1.DoneScheduleDto]),
    __metadata("design:returntype", rxjs_1.Observable)
], EnterpriseController.prototype, "doneSchedule", null);
__decorate([
    (0, common_1.Post)("upload-avatar"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("image")),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], EnterpriseController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.Post)("update-profile"),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, enterprise_edit_dto_1.EnterpriseEditDto]),
    __metadata("design:returntype", rxjs_1.Observable)
], EnterpriseController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Get)("get-overview-analysis"),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], EnterpriseController.prototype, "getOverviewAnalysis", null);
__decorate([
    (0, common_1.Post)("payment-url"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Ip)()),
    __param(2, (0, common_1.Res)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, payment_url_dto_1.PaymentDtoUrl]),
    __metadata("design:returntype", void 0)
], EnterpriseController.prototype, "getPaymentUrl", null);
__decorate([
    (0, common_1.Get)("vnp_ipn"),
    (0, public_guard_decorator_1.Public)(),
    __param(0, (0, common_1.Query)("vnp_Amount")),
    __param(1, (0, common_1.Query)("vnp_TransactionNo")),
    __param(2, (0, common_1.Query)("vnp_ResponseCode")),
    __param(3, (0, common_1.Query)("vnp_TxnRef")),
    __param(4, (0, common_1.Req)()),
    __param(5, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String, Object, Object]),
    __metadata("design:returntype", void 0)
], EnterpriseController.prototype, "confirmPayment", null);
__decorate([
    (0, common_1.Post)("vnp_ipn_client"),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EnterpriseController.prototype, "handleConfirmTransactionFromClient", null);
__decorate([
    (0, public_guard_decorator_1.Public)(),
    (0, common_1.Post)('testne'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EnterpriseController.prototype, "test", null);
EnterpriseController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtEnterpriseAuthGuard),
    (0, common_1.Controller)({ path: "enterprise", scope: common_1.Scope.REQUEST }),
    __param(1, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [enterprise_service_1.EnterpriseService, Object, config_1.ConfigService])
], EnterpriseController);
exports.EnterpriseController = EnterpriseController;
//# sourceMappingURL=enterprise.controller.js.map