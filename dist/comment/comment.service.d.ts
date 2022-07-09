import { PostModel } from "../database/model/post.model";
import { CommentModel } from "../database/model/comment.model";
import { UserModel } from "../database/model/user.model";
export declare class CommentService {
    private readonly userModel;
    private readonly postModel;
    private readonly commentModel;
    constructor(userModel: UserModel, postModel: PostModel, commentModel: CommentModel);
    fetchManyComments(postId: string, limit: number): Promise<string[]>;
    createComment(owner: number, post: string, content: string): Promise<import("../database/model/post.model").Post>;
}
