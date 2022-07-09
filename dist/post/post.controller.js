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
const down_vote_dto_1 = require("./dto/down-vote.dto");
const favorite_dto_1 = require("./dto/favorite.dto");
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
        try {
            let post = await this.postService.upVote(req, body.postId);
            return res.status(common_1.HttpStatus.OK).send({ post });
        }
        catch (e) {
            throw e;
        }
    }
    async downVotePost(res, req, body) {
        try {
            let post = await this.postService.downVote(req, body.postId);
            return res.status(common_1.HttpStatus.OK).send({ post });
        }
        catch (e) {
            throw e;
        }
    }
    async favoritePost(res, req, body) {
        try {
            let success = await this.postService.favoritePost(req, body.postId);
            if (success) {
                return res.status(common_1.HttpStatus.OK).send({ status: "success" });
            }
            throw new common_1.BadRequestException('Wrong!');
        }
        catch (e) {
            throw e;
        }
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
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('up-vote'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, up_vote_dto_1.UpVoteDto]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "upVotePost", null);
__decorate([
    (0, common_1.UseGuards)(tini_guard_1.TiniGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('down-vote'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, down_vote_dto_1.DownVoteDto]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "downVotePost", null);
__decorate([
    (0, common_1.UseGuards)(tini_guard_1.TiniGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('favorite'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, favorite_dto_1.FavoritePostDto]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "favoritePost", null);
PostController = __decorate([
    (0, common_1.Controller)('post'),
    __metadata("design:paramtypes", [post_service_1.PostService])
], PostController);
exports.PostController = PostController;
//# sourceMappingURL=post.controller.js.map