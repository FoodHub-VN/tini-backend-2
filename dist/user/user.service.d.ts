import { UserModel } from '../database/model/user.model';
import { AuthReqInterface } from '../auth/interface/auth-req.interface';
export declare class UserService {
    private userModel;
    constructor(userModel: UserModel);
    fetchUserById(id: number): Promise<import("../database/model/user.model").User>;
    followUser(req: AuthReqInterface, userId: number): Promise<boolean>;
    unFollowUser(req: AuthReqInterface, userId: number): Promise<boolean>;
}
