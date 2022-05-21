"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('mongodb', () => {
    let { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, } = process.env;
    DB_HOST = DB_HOST || "localhost";
    DB_PORT = DB_PORT || "27017";
    DB_NAME = DB_NAME || "nestjs-test";
    console.log("uri: ", `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`);
    return {
        uri: `mongodb://${DB_HOST}:${DB_PORT}`
    };
});
//# sourceMappingURL=mongodb.config.js.map