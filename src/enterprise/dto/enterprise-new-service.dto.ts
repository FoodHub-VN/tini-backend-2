import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsPhoneNumber,
  ValidateNested
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { plainToClass, Transform, Type } from "class-transformer";
import { Address } from "../../shared/common.type";
import { Types } from "mongoose";

export class EnterPriseNewServiceDataDto {
  @ApiProperty({
    type: String,
    required: true
  })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    type: String,
    required: true
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    type: Number,
    required: true
  })
  @IsNotEmpty()
  readonly phone: string;

  @ApiProperty({
    type: Date,
    required: false
  })
  @IsOptional()
  readonly openTime?: string;

  @ApiProperty({
    type: Date,
    required: false
  })
  @IsOptional()
  readonly closeTime?: string;


  @ApiProperty({
    type: ()=>Address,
    required: true
  })
  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Transform(({ value })=>{
    return plainToClass(Address, JSON.parse(value));
  })
  @Type(()=>Address)

  readonly address: Address;

  @ApiProperty({
    type: Types.ObjectId,
    required: true
  })
  @IsNotEmpty()
  readonly category: string

  @IsOptional()
  @ApiProperty({
    type: Number,
    required: false
  })
  readonly maxPrice: number;

  @IsOptional()
  @ApiProperty({
    type: Number,
    required: false
  })
  readonly minPrice: number;

  @IsOptional()
  @Transform(({ value })=>{
    return JSON.parse(value);
  })

  @Type(()=>Array)
  readonly removeImg: string[];

  @IsOptional()
  @ApiProperty({
    type: String,
    required: false
  })
  readonly introduction: string;
}

