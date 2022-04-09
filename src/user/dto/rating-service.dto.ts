import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { plainToClass, Transform, Type } from "class-transformer";
import { Address } from "../../shared/common.type";

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
  @Transform(({ value })=>{
    return JSON.parse(value);
  })
  @Type(()=>Array)
  readonly score: number[];


  @ApiProperty({
    type: String,
    required: false
  })
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({
    type: String,
    required: false
  })
  @IsNotEmpty()
  readonly content: string;
}