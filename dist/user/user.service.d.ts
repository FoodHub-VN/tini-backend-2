import { UserModel } from '../database/model/user.model';
import { AuthReqInterface } from '../auth/interface/auth-req.interface';
export declare class UserService {
    private userModel;
    constructor(userModel: UserModel);
    followUser(req: AuthReqInterface, userId: number): Promise<boolean>;
    unFollowUser(req: AuthReqInterface, userId: number): Promise<boolean>;
}
