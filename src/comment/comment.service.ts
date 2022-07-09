import {Inject, Injectable} from '@nestjs/common';
import {COMMENT_MODEL, POST_MODEL, USER_MODEL} from "../database/database.constants";
import {PostModel} from "../database/model/post.model";
import {CommentModel} from "../database/model/comment.model";
import {UserModel} from "../database/model/user.model";

@Injectable()
export class CommentService {
    constructor(@Inject(USER_MODEL) private readonly userModel: UserModel,
                @Inject(POST_MODEL) private readonly postModel: PostModel,
                @Inject(COMMENT_MODEL) private readonly commentModel: CommentModel,) {
    }

    async fetchManyComments(id: string, limit: number) {
        console.log(await this.postModel
            .findById(id, {_id: 0, comment: 1})
            .populate('comment')
            .populate('comment.owner')
            .projection({owner: 1, title: 1, content: 1, timeComment: 1})
            .exec())
        return this.postModel
            .findById(id, {_id: 0, comment: 1})
            .populate('comment')
            .map(post => post.comment)
            .projection({owner: 1, title: 1, content: 1, timeComment: 1})
            .populate('owner')
            .projection({owner: {_id: 0}})
            .limit(limit)
            .exec();
    }
}
