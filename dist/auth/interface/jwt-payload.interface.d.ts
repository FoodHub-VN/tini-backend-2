import { RolesType } from "../../shared/roles-type.enum";
export declare class JwtPayload {
    username: string;
    email: string;
    id: string;
    fullName: string;
    role: RolesType;
}
export declare class JwtEnterprisePayload {
    username: string;
    email: string;
    id: string;
    phone: string;
    fullName: string;
    role: RolesType;
}
export declare class JwtAdminPayload {
    username: string;
    role: RolesType;
}
