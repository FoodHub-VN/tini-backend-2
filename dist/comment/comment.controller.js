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
exports.CommentController = void 0;
const common_1 = require("@nestjs/common");
const comment_service_1 = require("./comment.service");
const get_all_comment_dto_1 = require("./dto/get-all-comment.dto");
const post_comment_dto_1 = require("./dto/post-comment.dto");
const tini_guard_1 = require("../auth/guard/tini.guard");
const swagger_1 = require("@nestjs/swagger");
let CommentController = class CommentController {
    constructor(commentService) {
        this.commentService = commentService;
    }
    async getAllComments(res, req) {
        try {
            const comments = await Promise.all(await this.commentService.fetchManyComments(req.id, req.limit || 5));
            return res.status(common_1.HttpStatus.OK).send({
                post: req.id,
                comments,
            });
        }
        catch (e) {
            throw new common_1.BadRequestException();
        }
    }
    async postComment(res, req, body) {
        try {
            await this.commentService.createComment(req.user.customer_id, body.postId, body.title, body.content);
            return res.status(common_1.HttpStatus.OK).send();
        }
        catch (e) {
            throw new common_1.BadRequestException();
        }
    }
};
__decorate([
    (0, common_1.Post)('post/get-all-comment'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_all_comment_dto_1.GetAllCommentDto]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "getAllComments", null);
__decorate([
    (0, common_1.UseGuards)(tini_guard_1.TiniGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('post/post-comment'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, post_comment_dto_1.PostCommentDto]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "postComment", null);
CommentController = __decorate([
    (0, common_1.Controller)('comment'),
    __metadata("design:paramtypes", [comment_service_1.CommentService])
], CommentController);
exports.CommentController = CommentController;
//# sourceMappingURL=comment.controller.js.map