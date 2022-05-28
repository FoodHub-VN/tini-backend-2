import { Address } from "../../shared/common.type";
export declare class EnterPriseNewServiceDataDto {
    readonly name: string;
    readonly email: string;
    readonly phone: string;
    readonly openTime?: string;
    readonly closeTime?: string;
    readonly address: Address;
    readonly category: string;
    readonly maxPrice: number;
    readonly minPrice: number;
    readonly removeImg: string[];
    readonly introduction: string;
    readonly shortIntroduction: string;
    readonly enableSchedule: boolean;
    readonly scheduleAllowedPerHour: number;
}
