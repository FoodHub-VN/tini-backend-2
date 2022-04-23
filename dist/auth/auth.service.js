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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../user/user.service");
const enterprise_service_1 = require("../enterprise/enterprise.service");
const roles_type_enum_1 = require("../shared/roles-type.enum");
let AuthService = class AuthService {
    constructor(jwtService, userService, enterpriseService) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.enterpriseService = enterpriseService;
    }
    validateUser(username, password) {
        return this.userService.findUserWithPassByName(username).pipe((0, rxjs_1.mergeMap)(user => {
            if (!user) {
                throw new common_1.UnauthorizedException("Username not match");
            }
            else {
                return user.comparePassword(password).pipe((0, rxjs_1.map)(m => {
                    var _a;
                    if (m) {
                        return {
                            username: user.username,
                            email: user.email,
                            id: user._id,
                            fullName: user.fullName,
                            role: roles_type_enum_1.RolesType.CUSTOMER,
                            avatar: (_a = user.avatar) === null || _a === void 0 ? void 0 : _a.url
                        };
                    }
                    else {
                        throw new common_1.UnauthorizedException("Password not match");
                    }
                }));
            }
        }));
    }
    validateEnterprise(username, password) {
        return this.enterpriseService.findEnterpriseWithPassByName(username).pipe((0, rxjs_1.mergeMap)(ep => {
            if (!ep) {
                throw new common_1.UnauthorizedException("Enterprise not found");
            }
            else {
                return ep.comparePassword(password).pipe((0, rxjs_1.map)(m => {
                    if (m) {
                        return {
                            username: ep.username,
                            email: ep.email,
                            id: ep._id,
                            fullName: ep.fullName,
                            phone: ep.phone,
                            role: roles_type_enum_1.RolesType.PROVIDER
                        };
                    }
                    else {
                        throw new common_1.UnauthorizedException("Password is incorrect");
                    }
                }));
            }
        }));
    }
    validateAdmin(username, password) {
        if (username == "longhuynh" && password == "longhuynh") {
            return (0, rxjs_1.of)({
                username: "longhuynh",
                role: roles_type_enum_1.RolesType.ADMIN
            });
        }
        else {
            throw new common_1.UnauthorizedException("Account not correct");
        }
    }
    login(user) {
        const payload = Object.assign({}, user);
        return (0, rxjs_1.from)(this.jwtService.signAsync(payload)).pipe((0, rxjs_1.map)((access_token) => {
            return { accessToken: access_token, user: user };
        }));
    }
    loginEnterprise(enterprise) {
        const payload = Object.assign({}, enterprise);
        return (0, rxjs_1.from)(this.jwtService.signAsync(payload)).pipe((0, rxjs_1.map)((access_token) => {
            return { accessToken: access_token, enterprise: enterprise };
        }));
    }
    loginAdmin(admin) {
        const payload = Object.assign({}, admin);
        return (0, rxjs_1.from)(this.jwtService.signAsync(payload)).pipe((0, rxjs_1.map)((access_token) => {
            return { accessToken: access_token };
        }));
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        user_service_1.UserService,
        enterprise_service_1.EnterpriseService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map