"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HasRole = void 0;
const common_1 = require("@nestjs/common");
const auth_constants_1 = require("../auth.constants");
const HasRole = (roles) => (0, common_1.SetMetadata)(auth_constants_1.HAS_ROLE, roles);
exports.HasRole = HasRole;
//# sourceMappingURL=has-role.decorator.js.map