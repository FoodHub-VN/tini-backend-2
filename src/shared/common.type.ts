import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

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
    required: false
  })
  @IsOptional()
  readonly detail: string;
}