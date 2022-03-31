import {RolesType} from "../../shared/roles-type.enum";

export class JwtPayload{
    username: string;
    email: string;
    id: string;
    fullName: string;
    role: RolesType;
}

export class JwtEnterprisePayload{
    username: string;
    email: string;
    id: string;
    phone: string;
    name: string;
    role: RolesType;
}
export class JwtAdminPayload{
    username: string;
    role: RolesType;
}
