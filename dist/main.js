"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const fs_1 = require("fs");
async function bootstrap() {
    const httpsOptions = {
        key: fs_1.default.readFileSync('./ssl/0000_key-certbot.pem'),
        cert: fs_1.default.readFileSync('./ssl/0000_csr-certbot.pem'),
    };
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: true, httpsOptions });
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true, whitelist: true }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle("[FoodHub APIs]")
        .setDescription("The RESTful APIs from super dev")
        .setVersion('1.0')
        .addTag('FoodHub')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(3007);
}
bootstrap();
//# sourceMappingURL=main.js.map