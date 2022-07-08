import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Types } from 'mongoose';

export class PostUploadDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNotEmpty()
  readonly phone: string;

  @ApiProperty({
    type: Date,
    required: false,
  })
  @IsOptional()
  readonly openTime?: string;

  @ApiProperty({
    type: Date,
    required: false,
  })
  @IsOptional()
  readonly closeTime?: string;

  @ApiProperty({
    type: Types.ObjectId,
    required: true,
  })
  @IsNotEmpty()
  readonly category: string;

  @IsOptional()
  @ApiProperty({
    type: Number,
    required: false,
  })
  readonly maxPrice: number;

  @IsOptional()
  @ApiProperty({
    type: Number,
    required: false,
  })
  readonly minPrice: number;

  @IsOptional()
  @Transform(({ value }) => {
    return JSON.parse(value);
  })

  @Type(() => Array)
  readonly removeImg: string[];

  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
  })
  readonly introduction: string;

  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
  })
  readonly shortIntroduction: string;

  @IsNotEmpty()
  @ApiProperty({
    type: Boolean,
    required: true,
  })
  readonly enableSchedule: boolean;
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    required: true,
  })
  readonly scheduleAllowedPerHour: number;
}