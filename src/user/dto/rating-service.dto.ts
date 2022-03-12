import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class RatingServiceDto{
  @ApiProperty({
    type: String,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  readonly serviceId: string;

  @ApiProperty({
    type: Array,
    required: true
  })
  @IsArray()
  @IsNotEmpty()
  readonly score: number[];


  @ApiProperty({
    type: String,
    required: false
  })
  @IsOptional()
  readonly title: string;

  @ApiProperty({
    type: String,
    required: false
  })
  @IsOptional()
  readonly content: string;
}