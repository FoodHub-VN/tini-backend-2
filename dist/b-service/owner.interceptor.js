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
exports.OwnerInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const mongoose_1 = require("mongoose");
const database_constants_1 = require("../database/database.constants");
let OwnerInterceptor = class OwnerInterceptor {
    constructor(serviceModel, enterpriseModel) {
        this.serviceModel = serviceModel;
        this.enterpriseModel = enterpriseModel;
    }
    intercept(context, next) {
        const req = context.switchToHttp().getRequest();
        let enterprise = req.user.id;
        let service = req.params['idService'];
        if (!mongoose_1.Types.ObjectId.isValid(service)) {
            throw new common_1.ConflictException("Enterprise doesn't own Service!");
        }
        if (!mongoose_1.Types.ObjectId.isValid(enterprise)) {
            throw new common_1.UnauthorizedException();
        }
        return (0, rxjs_1.from)(this.enterpriseModel.findOne({ _id: mongoose_1.Types.ObjectId(enterprise) }).exec()).pipe((0, rxjs_1.mergeMap)((e) => {
            if (!e) {
                throw new common_1.UnauthorizedException();
            }
            else {
                return (0, rxjs_1.from)(this.serviceModel.findOne({ _id: mongoose_1.Types.ObjectId(service) }).exec()).pipe((0, rxjs_1.mergeMap)((s) => {
                    if (!s || s.enterprise != enterprise) {
                        throw new common_1.ConflictException("Enterprise doesn't own Service!");
                    }
                    else {
                        return next.handle();
                    }
                }));
            }
        }));
    }
};
OwnerInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_constants_1.SERVICE_MODEL)),
    __param(1, (0, common_1.Inject)(database_constants_1.ENTERPRISE_MODEL)),
    __metadata("design:paramtypes", [Object, Object])
], OwnerInterceptor);
exports.OwnerInterceptor = OwnerInterceptor;
//# sourceMappingURL=owner.interceptor.js.map