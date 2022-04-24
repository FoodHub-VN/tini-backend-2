"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('jwt', () => {
    return {
        secretKey: process.env.JWT_SECRET_KEY || 'rzxlszyykpbgqcflzxsqcysyhljt',
        expiresIn: process.env.JWT_EXPIRES_IN || '3600s',
    };
});
//# sourceMappingURL=jwtConfig.config.js.map