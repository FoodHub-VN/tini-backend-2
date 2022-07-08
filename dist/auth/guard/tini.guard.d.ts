import { CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserModel } from '../../database/model/user.model';
export declare class TiniGuard implements CanActivate {
    private readonly authService;
    private userModel;
    constructor(authService: AuthService, userModel: UserModel);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
