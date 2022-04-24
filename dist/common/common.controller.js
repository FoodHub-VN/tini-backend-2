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
exports.CommonController = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const common_service_1 = require("./common.service");
const b_service_service_1 = require("../b-service/b-service.service");
const user_service_1 = require("../user/user.service");
let CommonController = class CommonController {
    constructor(commonService, bService, userService) {
        this.commonService = commonService;
        this.bService = bService;
        this.userService = userService;
    }
    getCategory(res) {
        return this.commonService.getCategories().pipe((0, rxjs_1.map)((category) => {
            if (category) {
                return res.status(common_1.HttpStatus.OK).send({ categories: category });
            }
            else {
                throw new common_1.BadRequestException();
            }
        }));
    }
    getServiceInfo(res, idService) {
        return (0, rxjs_1.from)(this.bService.getInfo(idService)).pipe((0, rxjs_1.map)((s) => {
            if (!s) {
                throw new common_1.NotFoundException("Service not found!");
            }
            else {
                return res.status(common_1.HttpStatus.OK).send({ service: s });
            }
        }));
    }
    getCommentService(res, idService) {
        return (0, rxjs_1.from)(this.bService.getComment(idService)).pipe((0, rxjs_1.map)(comments => {
            return res.status(common_1.HttpStatus.OK).send({ comments: comments });
        }), (0, rxjs_1.catchError)((e) => {
            throw new common_1.BadRequestException("Something wrong!");
        }));
    }
    getUserInfo(res, userId) {
        return (0, rxjs_1.from)(this.userService.findUserById(userId)).pipe((0, rxjs_1.map)(u => {
            return res.status(common_1.HttpStatus.OK).send({ user: u });
        }), (0, rxjs_1.catchError)((e) => {
            throw new common_1.BadRequestException('Something wrong!');
        }));
    }
    getServiceScore(res, idService) {
        return (0, rxjs_1.from)(this.bService.getServiceScore(idService)).pipe((0, rxjs_1.map)(score => {
            return res.status(common_1.HttpStatus.OK).send({ score });
        }), (0, rxjs_1.catchError)((e) => {
            console.log(e);
            throw new common_1.BadRequestException("Something wrong!");
        }));
    }
};
__decorate([
    (0, common_1.Get)('/categories'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], CommonController.prototype, "getCategory", null);
__decorate([
    (0, common_1.Get)('/service/:idService'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('idService')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], CommonController.prototype, "getServiceInfo", null);
__decorate([
    (0, common_1.Get)("/service/:idService/comments"),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('idService')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], CommonController.prototype, "getCommentService", null);
__decorate([
    (0, common_1.Get)('user-info/:userId'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", rxjs_1.Observable)
], CommonController.prototype, "getUserInfo", null);
__decorate([
    (0, common_1.Get)("/service/:idService/scores"),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('idService')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], CommonController.prototype, "getServiceScore", null);
CommonController = __decorate([
    (0, common_1.Controller)(''),
    __metadata("design:paramtypes", [common_service_1.CommonService,
        b_service_service_1.BServiceService,
        user_service_1.UserService])
], CommonController);
exports.CommonController = CommonController;
//# sourceMappingURL=common.controller.js.map