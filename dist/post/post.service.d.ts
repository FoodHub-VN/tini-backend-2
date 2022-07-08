/// <reference types="multer" />
import { PostModel } from '../database/model/post.model';
import { PostUploadDto } from './dto/post-upload.dto';
import { FileUploadService } from '../upload/upload.service';
import { AuthReqInterface } from '../auth/interface/auth-req.interface';
export declare class PostService {
    private postModel;
    private readonly uploadService;
    constructor(postModel: PostModel, uploadService: FileUploadService);
    uploadPost(body: PostUploadDto, _images: Array<Express.Multer.File>, req: AuthReqInterface): Promise<any>;
    getAllPost(): Promise<any>;
}
