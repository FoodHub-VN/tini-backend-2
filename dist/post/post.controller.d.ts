/// <reference types="multer" />
import { PostService } from './post.service';
import { Response } from 'express';
import { PostUploadDto } from './dto/post-upload.dto';
export declare class PostController {
    private readonly postService;
    constructor(postService: PostService);
    uploadPost(res: Response, files: Array<Express.Multer.File>, data: PostUploadDto): void;
}
