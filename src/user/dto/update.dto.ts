import {
    IsDateString,
    IsEmail,
    IsNotEmpty, IsOptional,
    IsPhoneNumber,
    IsString,
    MaxLength,
    MinLength,
    ValidateNested
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Address } from "../../shared/common.type";
import { plainToClass, Transform, Type } from "class-transformer";

export class UpdateProfileDto{
    @IsOptional()
    @IsString()
    @IsEmail()
    @ApiProperty({
        type: String,
        required: true
    })
    readonly email?: string;


    @IsOptional()
    @IsString()
    @ApiProperty({
        type: String,
        required: true
    })
    readonly fullName?: string;

    @IsOptional()
    @IsPhoneNumber("VI")
    @ApiProperty({
        type: Number,
        required: true
    })
    readonly phone?: number;

    @IsOptional()
    @IsDateString()
    @ApiProperty({
        type: Date,
        required: true
    })
    readonly birthday?: Date;

    @ValidateNested()
    @IsOptional()
    @ApiProperty({
        type: Address,
        required: true
    })
    @Transform(({ value }) => {
        return plainToClass(Address, JSON.parse(value))
    })
    @Type(() => Address)
    readonly address?: Address;
}
