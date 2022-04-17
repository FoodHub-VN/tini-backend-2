
import {
  IsDefined,
  IsEmail,
  IsNotEmpty, IsNotEmptyObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength, ValidateNested
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Address } from "../../shared/common.type";
import { plainToClass, Transform, Type } from "class-transformer";

export class EnterpriseEditDto {

  @ApiProperty({
    type: String,
    required: false
  })
  @IsOptional()
  @IsString()
  readonly fullName: string;

  @ApiProperty({
    type: String,
    required: false
  })
  @IsOptional()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    type: String,
    required: false
  })
  @IsOptional()
  @IsString()
  readonly phone: string;

  @ValidateNested()
  @IsOptional()
  @ApiProperty({
    type: Address,
    required: false
  })
  @Type(() => Address)
  readonly address?: Address;
}