"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('mongodb', () => {
    const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, } = process.env;
    console.log("uri: ", `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`);
    return {
        uri: `mongodb://${DB_HOST}:${DB_PORT}`
    };
});
//# sourceMappingURL=mongodb.config.js.map