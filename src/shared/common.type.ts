import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class Address {
  @ApiProperty({
    type: Number,
    required: true
  })
  @IsNotEmpty()
  readonly province: number;

  @ApiProperty({
    type: Number,
    required: true
  })
  @IsNotEmpty()
  readonly district: number;

  @ApiProperty({
    type: Number,
    required: true
  })
  @IsNotEmpty()
  readonly village: number;

  @ApiProperty({
    type: String,
    required: true
  })
  @IsNotEmpty()
  readonly detail: string;
}