import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import {Request} from 'express';
import { AuthService } from '../auth.service';


@Injectable()
export class TiniGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {

  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    let req: Request = context.switchToHttp().getRequest();
    let token = req.headers.authorization;
    if(!token) return false;
    try{
      const user = await this.authService.validateToken(token);
      req.user = user;
      return true;
    }
    catch (e){
      throw e;
    }
    // console.log(this.authService.validateToken(token));
    return false;
  }

}
