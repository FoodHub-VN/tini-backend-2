import { Address } from "../../shared/common.type";
export declare class UserRegisterDto {
    readonly username: string;
    readonly email: string;
    readonly password: string;
    readonly fullName: string;
    readonly phone: number;
    readonly birthday: Date;
    readonly address: Address;
}
