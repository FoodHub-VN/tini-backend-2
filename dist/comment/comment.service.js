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
exports.CommentService = void 0;
const common_1 = require("@nestjs/common");
const database_constants_1 = require("../database/database.constants");
let CommentService = class CommentService {
    constructor(userModel, postModel, commentModel) {
        this.userModel = userModel;
        this.postModel = postModel;
        this.commentModel = commentModel;
    }
    async fetchManyComments(id, limit) {
        return this.postModel
            .findById(id)
            .populate({ path: 'comment', select: { post: 0 } })
            .map(post => post.comment)
            .limit(limit)
            .populate({ path: 'owner', select: 'customerName' })
            .exec();
    }
};
CommentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_constants_1.USER_MODEL)),
    __param(1, (0, common_1.Inject)(database_constants_1.POST_MODEL)),
    __param(2, (0, common_1.Inject)(database_constants_1.COMMENT_MODEL)),
    __metadata("design:paramtypes", [Object, Object, Object])
], CommentService);
exports.CommentService = CommentService;
//# sourceMappingURL=comment.service.js.map