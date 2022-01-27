import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsPhoneNumber,
  ValidateNested
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class EnterPriseNewServiceDataDto{
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
}

