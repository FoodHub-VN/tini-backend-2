"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const mongoose_1 = require("@nestjs/mongoose");
const auth_module_1 = require("./auth/auth.module");
const user_module_1 = require("./user/user.module");
const database_module_1 = require("./database/database.module");
const config_1 = require("@nestjs/config");
const enterprise_module_1 = require("./enterprise/enterprise.module");
const b_service_module_1 = require("./b-service/b-service.module");
const upload_module_1 = require("./upload/upload.module");
const search_module_1 = require("./search/search.module");
const admin_module_1 = require("./admin/admin.module");
const common_module_1 = require("./common/common.module");
const notification_module_1 = require("./notification/notification.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                ignoreEnvFile: false
            }),
            mongoose_1.MongooseModule.forRoot(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`),
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            database_module_1.DatabaseModule,
            enterprise_module_1.EnterpriseModule,
            b_service_module_1.BServiceModule,
            upload_module_1.UploadModule,
            search_module_1.SearchModule,
            admin_module_1.AdminModule,
            common_module_1.CommonModule,
            notification_module_1.NotificationModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map