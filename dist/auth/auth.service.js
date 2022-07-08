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
const axios_1 = require("@nestjs/axios");
let AuthService = class AuthService {
    constructor(httpService) {
        this.httpService = httpService;
        this.client_key = "cTYxTIahEP0vFXYMXuc4qjpQdTLd4w7m";
        this.client_secret = "VADyWlmfsws:HRzIZsFear@WUyitMs:P1si+MzVSbVQgBnuyNemaJyp3GJlcFb4p";
    }
    async sign(body) {
        const crypto = require("crypto");
        const timestamp = Date.now();
        function base64URLEncode(data) {
            const base64 = Buffer.from(data, "utf8").toString("base64");
            return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
        }
        let sign = (secret, payload) => {
            const signature = crypto
                .createHmac("sha256", this.client_secret)
                .update(payload)
                .digest("hex");
            return signature;
        };
        const payload = timestamp + '.' + this.client_key + '.' + JSON.stringify(body);
        console.log("payload: ", payload);
        const encodedPayload = base64URLEncode(payload);
        console.log("encoded_payload: ", encodedPayload);
        const signature = sign(this.client_secret, encodedPayload);
        console.log("signature: ", signature);
        return { signature, timestamp };
    }
    async exchangeToAccessToken(body) {
        let { signature, timestamp } = await this.sign(body);
        let url = "https://api.tiki.vn/tiniapp-open-api/oauth/auth/token";
        return this.httpService.post(url, Object.assign({}, body), {
            headers: {
                "Content-Type": "application/json",
                "X-Tiniapp-Client-Id": this.client_key,
                "X-Tiniapp-Signature": signature,
                "X-Tiniapp-Timestamp": timestamp
            }
        }).toPromise().then((r) => {
            return r.data;
        }).catch(e => {
            throw new common_1.BadRequestException("Auth code wrong!");
        });
    }
    async validateToken(token) {
        let obj = {
            access_token: token.split("Bearer ")[1]
        };
        let { signature, timestamp } = await this.sign(obj);
        let url = "https://api.tiki.vn/tiniapp-open-api/oauth/me";
        return this.httpService.post(url, obj, {
            headers: {
                "Content-Type": "application/json",
                "X-Tiniapp-Client-Id": this.client_key,
                "X-Tiniapp-Signature": signature,
                "X-Tiniapp-Timestamp": timestamp
            }
        }).toPromise().then((r) => {
            return r.data.data;
        }).catch(e => {
            throw new common_1.UnauthorizedException("Lỗi xác thực!");
        });
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map