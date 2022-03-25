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


    @IsOptional()
    @IsString()
    @ApiProperty({
        type: String,
        required: false
    })
    readonly fullName: string;

    @IsOptional()
    @IsPhoneNumber("VI")
    @ApiProperty({
        type: Number,
        required: false
    })
    readonly phone: number;

    @IsOptional()
    @IsDateString()
    @ApiProperty({
        type: Date,
        required: false
    })
    readonly birthday: Date;

    @ValidateNested()
    @IsOptional()
    @ApiProperty({
        type: Address,
        required: false
    })
    // @Transform(({ value }) => {
    //     return plainToClass(Address, JSON.parse(value))
    // })
    @Type(() => Address)
    readonly address: Address;
}