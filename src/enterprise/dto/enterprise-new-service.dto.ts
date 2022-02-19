import { IsDefined, IsEmail, IsNotEmpty, IsNotEmptyObject, IsPhoneNumber, ValidateNested } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { plainToClass, Transform, Type } from "class-transformer";
import { Address } from "../../shared/common.type";

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
  @IsPhoneNumber()
  readonly phone: number;

  @ApiProperty({
    type: String,
    required: true
  })
  @IsNotEmpty()
  readonly type: string;

  @ApiProperty({
    type: Date,
    required: false
  })
  readonly openTime?: Date;

  @ApiProperty({
    type: Date,
    required: false
  })
  readonly closeTime?: Date;


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
}

