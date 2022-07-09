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
exports.PostService = void 0;
const common_1 = require("@nestjs/common");
const database_constants_1 = require("../database/database.constants");
const upload_service_1 = require("../upload/upload.service");
let PostService = class PostService {
    constructor(postModel, userModel, uploadService) {
        this.postModel = postModel;
        this.userModel = userModel;
        this.uploadService = uploadService;
    }
    async uploadPost(body, req) {
        try {
            let user = await this.userModel.findOne({ _id: req.user.customer_id }).exec();
            if (!user) {
                throw new common_1.NotFoundException('User not found!');
            }
            let post = await this.postModel.create(Object.assign({ owner: req.user.customer_id }, body));
            let postId = user.post;
            postId.push(post._id);
            await user.update({ post: postId }).exec();
            return;
        }
        catch (e) {
            console.log(e);
            throw new common_1.BadRequestException('Wrong!!');
        }
    }
    async getAllPost() {
        try {
            let posts = await this.postModel
                .find({})
                .populate('owner', 'customerName')
                .exec();
            return posts;
        }
        catch (e) {
            console.log(e);
        }
    }
    async upVote(req, postId) {
        try {
            let post = await this.postModel.findOne({ _id: postId });
            if (!post) {
                throw new common_1.NotFoundException('Post not found!');
            }
            var update = {};
            let isDirty = false;
            if (post.downVotedBy.includes(req.user.customer_id)) {
                update.downVotedBy = post.downVotedBy.filter((e) => e != req.user.customer_id);
                isDirty = true;
            }
            let user = await this.userModel.findOne({ _id: req.user.customer_id }).exec();
            if (!user) {
                throw new common_1.NotFoundException('User not found!');
            }
            if (!post.upVotedBy.includes(req.user.customer_id)) {
                update.upVotedBy = post.upVotedBy || [];
                update.upVotedBy.push(req.user.customer_id);
                let likePost = user.likePost.filter(p => p != post._id);
                likePost.push(post._id);
                await user.update({ likePost }).exec();
                isDirty = true;
            }
            if (isDirty) {
                return await this.postModel.findOneAndUpdate({ _id: postId }, Object.assign({}, update), { new: true, lean: true }).exec();
            }
            return post;
        }
        catch (e) {
            throw e;
        }
    }
    async downVote(req, postId) {
        try {
            let post = await this.postModel.findOne({ _id: postId });
            if (!post) {
                throw new common_1.NotFoundException('Post not found!');
            }
            var update = {};
            let isDirty = false;
            if (post.upVotedBy.includes(req.user.customer_id)) {
                update.upVotedBy = post.upVotedBy.filter((e) => e != req.user.customer_id);
                isDirty = true;
            }
            let user = await this.userModel.findOne({ _id: req.user.customer_id }).exec();
            if (!post.downVotedBy.includes(req.user.customer_id)) {
                let likePost = user.likePost.filter(p => p != post._id);
                await user.update({ likePost }).exec();
                update.downVotedBy = post.downVotedBy || [];
                update.downVotedBy.push(req.user.customer_id);
                isDirty = true;
            }
            if (isDirty) {
                return await this.postModel.findOneAndUpdate({ _id: postId }, Object.assign({}, update), { new: true, lean: true }).exec();
            }
            return post;
        }
        catch (e) {
            throw e;
        }
    }
    async favoritePost(req, postId) {
        try {
            let user = await this.userModel.findOne({ _id: req.user.customer_id }).exec();
            if (!user) {
                throw new common_1.NotFoundException('User not found!');
            }
            let post = await this.postModel.findOne({ _id: postId }).exec();
            if (!post) {
                throw new common_1.NotFoundException('Post not found!');
            }
            let favorite = user.favoritePost.filter(p => p != post._id);
            favorite.push(post._id);
            await user.update({ favoritePost: favorite }).exec();
            return true;
        }
        catch (e) {
            throw e;
        }
    }
};
PostService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_constants_1.POST_MODEL)),
    __param(1, (0, common_1.Inject)(database_constants_1.USER_MODEL)),
    __metadata("design:paramtypes", [Object, Object, upload_service_1.FileUploadService])
], PostService);
exports.PostService = PostService;
//# sourceMappingURL=post.service.js.map