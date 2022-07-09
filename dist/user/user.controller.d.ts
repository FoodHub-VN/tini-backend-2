import { Response } from 'express';
import { FollowUserDto, UnFollowUserDto } from './dto/follow-user.dto';
import { AuthReqInterface } from '../auth/interface/auth-req.interface';
import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getUserById(res: Response, req: AuthReqInterface): Promise<Response<any, Record<string, any>>>;
    followUser(res: Response, body: FollowUserDto, req: AuthReqInterface): Promise<Response<any, Record<string, any>>>;
    unFollowUser(res: Response, body: UnFollowUserDto, req: AuthReqInterface): Promise<Response<any, Record<string, any>>>;
}
