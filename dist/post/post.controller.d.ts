import { PostService } from './post.service';
import { Response } from 'express';
import { PostUploadDto } from './dto/post-upload.dto';
import { AuthReqInterface } from '../auth/interface/auth-req.interface';
import { UpVoteDto } from './dto/up-vote.dto';
export declare class PostController {
    private readonly postService;
    constructor(postService: PostService);
    uploadPost(res: Response, data: PostUploadDto, req: AuthReqInterface): Promise<Response<any, Record<string, any>>>;
    getAllPost(res: Response): Promise<any>;
    upVotePost(res: Response, req: AuthReqInterface, body: UpVoteDto): Promise<void>;
}
