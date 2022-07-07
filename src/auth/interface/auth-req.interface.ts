import {Request} from 'express';
import { AuthUserInterface } from './auth-user.interface';
export interface AuthReqInterface extends Request{
  user: AuthUserInterface;
}