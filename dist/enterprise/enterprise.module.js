"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnterpriseModule = void 0;
const common_1 = require("@nestjs/common");
const enterprise_service_1 = require("./enterprise.service");
const enterprise_controller_1 = require("./enterprise.controller");
const database_module_1 = require("../database/database.module");
const b_service_module_1 = require("../b-service/b-service.module");
const nestjs_form_data_1 = require("nestjs-form-data");
const upload_module_1 = require("../upload/upload.module");
let EnterpriseModule = class EnterpriseModule {
};
EnterpriseModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule, b_service_module_1.BServiceModule, nestjs_form_data_1.NestjsFormDataModule, upload_module_1.UploadModule],
        providers: [enterprise_service_1.EnterpriseService],
        controllers: [enterprise_controller_1.EnterpriseController],
        exports: [enterprise_service_1.EnterpriseService]
    })
], EnterpriseModule);
exports.EnterpriseModule = EnterpriseModule;
//# sourceMappingURL=enterprise.module.js.map