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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const database_constants_1 = require("../database/database.constants");
const rxjs_1 = require("rxjs");
let AdminService = class AdminService {
    constructor(categoryModel) {
        this.categoryModel = categoryModel;
    }
    addCategory(category) {
        return (0, rxjs_1.from)(this.categoryModel.exists({ category: category })).pipe((0, rxjs_1.mergeMap)((res) => {
            if (res) {
                throw new common_1.ConflictException("Category had already added!");
            }
            else {
                return (0, rxjs_1.from)(this.categoryModel.create({ category: category })).pipe((0, rxjs_1.map)((category) => {
                    return category != null;
                }));
            }
        }));
    }
};
AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_constants_1.CATEGORY_MODEL)),
    __metadata("design:paramtypes", [Object])
], AdminService);
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map