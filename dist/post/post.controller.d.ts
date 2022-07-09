import { PostService } from './post.service';
import { Response } from 'express';
import { PostUploadDto } from './dto/post-upload.dto';
import { AuthReqInterface } from '../auth/interface/auth-req.interface';
import { UpVoteDto } from './dto/up-vote.dto';
import { DownVoteDto } from './dto/down-vote.dto';
import { FavoritePostDto } from './dto/favorite.dto';
import { GetPostByIdDto } from './dto/get-post-by-id.dto';
export declare class PostController {
    private readonly postService;
    constructor(postService: PostService);
    uploadPost(res: Response, data: PostUploadDto, req: AuthReqInterface): Promise<Response<any, Record<string, any>>>;
    getAllPost(res: Response): Promise<any>;
    upVotePost(res: Response, req: AuthReqInterface, body: UpVoteDto): Promise<Response<any, Record<string, any>>>;
    downVotePost(res: Response, req: AuthReqInterface, body: DownVoteDto): Promise<Response<any, Record<string, any>>>;
    favoritePost(res: Response, req: AuthReqInterface, body: FavoritePostDto): Promise<Response<any, Record<string, any>>>;
    getPostById(res: Response, body: GetPostByIdDto): Promise<Response<any, Record<string, any>>>;
}
