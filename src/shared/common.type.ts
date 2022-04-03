import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class Address {
  @ApiProperty({
    type: String,
    required: true
  })
  @IsNotEmpty()
  readonly province: string;

  @ApiProperty({
    type: String,
    required: true
  })
  @IsNotEmpty()
  readonly district: string;

  @ApiProperty({
    type: String,
    required: true
  })
  @IsNotEmpty()
  readonly village: string;

  @ApiProperty({
    type: String,
    required: false
  })
  @IsOptional()
  readonly detail: string;
}