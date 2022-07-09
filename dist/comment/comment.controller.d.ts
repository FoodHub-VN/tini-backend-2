import { CommentService } from "./comment.service";
import { Response } from "express";
import { GetAllCommentDto } from "./dto/get-all-comment.dto";
import { PostCommentDto } from "./dto/post-comment.dto";
import { AuthReqInterface } from "../auth/interface/auth-req.interface";
export declare class CommentController {
    private readonly commentService;
    constructor(commentService: CommentService);
    getAllComments(res: Response, req: GetAllCommentDto): Promise<Response<any, Record<string, any>>>;
    postComment(res: Response, req: AuthReqInterface, body: PostCommentDto): Promise<Response<any, Record<string, any>>>;
}
