import { PostService } from './post.service';
import { Response } from 'express';
import { PostUploadDto } from './dto/post-upload.dto';
import { AuthReqInterface } from '../auth/interface/auth-req.interface';
import { FavoritePostDto } from './dto/favorite.dto';
import { GetPostByIdDto } from './dto/get-post-by-id.dto';
import { VoteDto } from "./dto/vote.dto";
export declare class PostController {
    private readonly postService;
    constructor(postService: PostService);
    uploadPost(res: Response, data: PostUploadDto, req: AuthReqInterface): Promise<Response<any, Record<string, any>>>;
    getAllPost(res: Response, req: AuthReqInterface): Promise<any>;
    upVotePost(res: Response, req: AuthReqInterface, body: VoteDto): Promise<Response<any, Record<string, any>>>;
    downVotePost(res: Response, req: AuthReqInterface, body: VoteDto): Promise<Response<any, Record<string, any>>>;
    unVotePost(res: Response, req: AuthReqInterface, body: VoteDto): Promise<Response<any, Record<string, any>>>;
    favoritePost(res: Response, req: AuthReqInterface, body: FavoritePostDto): Promise<Response<any, Record<string, any>>>;
    getPostById(res: Response, req: AuthReqInterface, body: GetPostByIdDto): Promise<Response<any, Record<string, any>>>;
}
