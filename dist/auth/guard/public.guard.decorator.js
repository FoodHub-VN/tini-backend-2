"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Public = void 0;
const common_1 = require("@nestjs/common");
const api_metadata_1 = require("../../shared/api-metadata");
const Public = () => {
    return (0, common_1.SetMetadata)(api_metadata_1.METADATA.PUBLIC, true);
};
exports.Public = Public;
//# sourceMappingURL=public.guard.decorator.js.map