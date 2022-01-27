import { EnterprisePrincipal } from "./enterprise-principal";
import {UserPrincipal} from "./user-principal";

export interface AuthenticatedRequest<T> extends Request{
    user?: T;
}
