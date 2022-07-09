import { CommentService } from "./comment.service";
import { Response } from "express";
import { GetAllCommentDto } from "./dto/get-all-comment.dto";
export declare class CommentController {
    private readonly commentService;
    constructor(commentService: CommentService);
    getAllComments(res: Response, req: GetAllCommentDto): Promise<Response<any, Record<string, any>>>;
}
