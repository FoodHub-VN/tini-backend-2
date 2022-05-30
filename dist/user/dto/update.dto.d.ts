import { Address } from "../../shared/common.type";
export declare class UpdateProfileDto {
    readonly email?: string;
    readonly fullName?: string;
    readonly phone?: string;
    readonly birthday?: Date;
    readonly address?: Address;
    readonly gender?: string;
}
