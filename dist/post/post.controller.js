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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostController = void 0;
const common_1 = require("@nestjs/common");
const post_service_1 = require("./post.service");
const swagger_1 = require("@nestjs/swagger");
const post_upload_dto_1 = require("./dto/post-upload.dto");
const tini_guard_1 = require("../auth/guard/tini.guard");
const up_vote_dto_1 = require("./dto/up-vote.dto");
let PostController = class PostController {
    constructor(postService) {
        this.postService = postService;
    }
    async uploadPost(res, data, req) {
        try {
            await this.postService.uploadPost(data, req);
            return res.status(200).send({ status: "success" });
        }
        catch (e) {
            throw e;
        }
    }
    async getAllPost(res) {
        try {
            let posts = await this.postService.getAllPost();
            return res.status(common_1.HttpStatus.OK).send({ posts });
        }
        catch (e) {
            throw new common_1.BadRequestException();
        }
    }
    async upVotePost(res, req, body) {
    }
};
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseGuards)(tini_guard_1.TiniGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, post_upload_dto_1.PostUploadDto, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "uploadPost", null);
__decorate([
    (0, common_1.Post)('get-all-post'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getAllPost", null);
__decorate([
    (0, common_1.UseGuards)(tini_guard_1.TiniGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, up_vote_dto_1.UpVoteDto]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "upVotePost", null);
PostController = __decorate([
    (0, common_1.Controller)('post'),
    __metadata("design:paramtypes", [post_service_1.PostService])
], PostController);
exports.PostController = PostController;
//# sourceMappingURL=post.controller.js.map