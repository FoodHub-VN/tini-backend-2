import { Address } from "../../shared/common.type";
export declare class EnterpriseEditDto {
    readonly fullName: string;
    readonly email: string;
    readonly phone: string;
    readonly address?: Address;
}
