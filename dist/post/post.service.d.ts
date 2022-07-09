import { Post, PostModel } from '../database/model/post.model';
import { PostUploadDto } from './dto/post-upload.dto';
import { FileUploadService } from '../upload/upload.service';
import { AuthReqInterface } from '../auth/interface/auth-req.interface';
import { UserModel } from '../database/model/user.model';
export declare class PostService {
    private postModel;
    private userModel;
    private readonly uploadService;
    constructor(postModel: PostModel, userModel: UserModel, uploadService: FileUploadService);
    uploadPost(body: PostUploadDto, req: AuthReqInterface): Promise<any>;
    getAllPost(): Promise<any>;
    upVote(req: AuthReqInterface, postId: string): Promise<Post>;
    downVote(req: AuthReqInterface, postId: string): Promise<Post>;
    unVote(req: AuthReqInterface, postId: string): Promise<Post>;
    favoritePost(req: AuthReqInterface, postId: string): Promise<boolean>;
    getPostById(postId: string): Promise<Post>;
}
