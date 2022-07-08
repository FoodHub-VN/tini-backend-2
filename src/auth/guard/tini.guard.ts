import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { USER_MODEL } from '../../database/database.constants';
import { UserModel } from '../../database/model/user.model';
import { AuthUserInterface } from '../interface/auth-user.interface';


@Injectable()
export class TiniGuard implements CanActivate {
  constructor(private readonly authService: AuthService,
              @Inject(USER_MODEL) private userModel: UserModel,
  ) {

  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let req: Request = context.switchToHttp().getRequest();
    let token = req.headers.authorization;
    if (!token) throw new UnauthorizedException('Lỗi xác thực!');
    try {
      const user: AuthUserInterface = await this.authService.validateToken(token);
      if (!user) throw new UnauthorizedException('Lỗi xác thực!');
      req.user = user;
      const existUser = await this.userModel.exists({ customerId: user.customer_id.toString() });
      if (!existUser) {
        await this.userModel.create({ customerId: user.customer_id, customerName: user.customer_name });
      }
      return true;
    } catch (e) {
      throw e;
    }
    // console.log(this.authService.validateToken(token));
    return false;
  }

}
