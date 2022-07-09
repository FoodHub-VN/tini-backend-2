import {Inject, Injectable} from '@nestjs/common';
import {COMMENT_MODEL, POST_MODEL, USER_MODEL} from "../database/database.constants";
import {PostModel} from "../database/model/post.model";
import {CommentModel, Comment} from "../database/model/comment.model";
import {UserModel} from "../database/model/user.model";
import {Types} from "mongoose";

import ObjectId = Types

@Injectable()
export class CommentService {
    constructor(@Inject(USER_MODEL) private readonly userModel: UserModel,
                @Inject(POST_MODEL) private readonly postModel: PostModel,
                @Inject(COMMENT_MODEL) private readonly commentModel: CommentModel,) {
    }

    async fetchManyComments(postId: string, limit: number) {
        return this.postModel
            .findById(postId)
            .populate({path: 'comment', select: {post: 0}})
            .map(post => post.comment)
            .limit(limit)
            .populate({path: 'owner', select: 'customerName'})
            .exec();
    }

    async createComment(owner: number, post: string, content: string) {
         const comment = this.commentModel
            .create({
                owner,
                post,
                content,
                timeComment: Date.now()
            });

        return this.postModel.findByIdAndUpdate(post, {$push:{comment:await comment}});
    }
}
