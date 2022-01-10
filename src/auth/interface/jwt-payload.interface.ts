import {RolesType} from "../../shared/roles-type.enum";

export class JwtPayload{
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    role: RolesType;
}

export class JwtEnterprisePayload{
    username: string;
    email: string;
    phone: number;
    role: RolesType;
}
