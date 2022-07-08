/// <reference types="multer" />
import { PostService } from './post.service';
import { Response } from 'express';
import { PostUploadDto } from './dto/post-upload.dto';
import { AuthReqInterface } from '../auth/interface/auth-req.interface';
export declare class PostController {
    private readonly postService;
    constructor(postService: PostService);
    uploadPost(res: Response, files: Array<Express.Multer.File>, data: PostUploadDto, req: AuthReqInterface): Promise<Response<any, Record<string, any>>>;
}
