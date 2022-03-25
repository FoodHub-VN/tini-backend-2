import {RolesType} from "../../shared/roles-type.enum";

export class UserPrincipal{
    username: string;
    email: string;
    id: string;
    fullName: string;
    role: RolesType;
    avatar: string;
}
