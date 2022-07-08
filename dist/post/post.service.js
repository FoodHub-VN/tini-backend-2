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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const common_1 = require("@nestjs/common");
const database_constants_1 = require("../database/database.constants");
const upload_service_1 = require("../upload/upload.service");
let PostService = class PostService {
    constructor(postModel, uploadService) {
        this.postModel = postModel;
        this.uploadService = uploadService;
    }
    async uploadPost(body, _images, req) {
        try {
            let promise = [];
            let imageUploadeds = [];
            if (_images.length > 0) {
                _images.map(image => {
                    promise.push(this.uploadService.upload(image));
                });
                imageUploadeds = await Promise.all(promise);
            }
            let { images } = body, _body = __rest(body, ["images"]);
            await this.postModel.create(Object.assign(Object.assign({ owner: req.user.customer_id }, _body), { images: imageUploadeds }));
            return;
        }
        catch (e) {
            console.log(e);
            throw new common_1.BadRequestException("Wrong!!");
        }
    }
    async getAllPost() {
        let posts = await this.postModel.find().populate(['owner']).exec();
        return posts;
    }
};
PostService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_constants_1.POST_MODEL)),
    __metadata("design:paramtypes", [Object, upload_service_1.FileUploadService])
], PostService);
exports.PostService = PostService;
//# sourceMappingURL=post.service.js.map