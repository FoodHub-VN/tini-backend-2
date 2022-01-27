import {RolesType} from "../../shared/roles-type.enum";

export class JwtPayload{
    username: string;
    email: string;
    id: string;
    firstname: string;
    lastname: string;
    role: RolesType;
}

export class JwtEnterprisePayload{
    username: string;
    email: string;
    id: string;
    phone: number;
    role: RolesType;
}
