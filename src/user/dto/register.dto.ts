import {
    IsDateString,
    IsEmail,
    IsNotEmpty,
    IsPhoneNumber,
    IsString,
    MaxLength,
    MinLength,
    ValidateNested
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Address } from "../../shared/common.type";
import { plainToClass, Transform, Type } from "class-transformer";

export class UserRegisterDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        required: true
    })
    readonly username: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @ApiProperty({
        type: String,
        required: true
    })
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        required: true
    })
    @MinLength(8, { message: " The min length of password is 8 " })
    @MaxLength(20, { message: " The password can't accept more than 20 characters " })
    readonly password: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        required: true
    })
    readonly firstname: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        required: true
    })
    readonly lastname: string;

    @IsNotEmpty()
    @IsPhoneNumber("VI")
    @ApiProperty({
        type: Number,
        required: true
    })
    readonly phone: number;

    @IsNotEmpty()
    @IsDateString()
    @ApiProperty({
        type: Date,
        required: true
    })
    readonly birthday: Date;

    @ValidateNested()
    @IsNotEmpty()
    @ApiProperty({
        type: Address,
        required: true
    })
    @Transform(({ value }) => {
        return plainToClass(Address, JSON.parse(value))
    })
    @Type(() => Address)
    readonly address: Address;
}