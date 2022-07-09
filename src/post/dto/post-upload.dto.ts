import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PostUploadDto {
  @ApiProperty({
    type: Array,
    required: false
  })
  @IsOptional()
  readonly images: string[];
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    type: Array,
    required: false
  })
  @IsOptional()
  hashtag: string[];

  @ApiProperty({
    type: Number,
    required: true
  })
  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @ApiProperty({
    type: String,
    required: true
  })
  @IsNotEmpty()
  @IsString()
  lat: string;

  @ApiProperty({
    type: String,
    required: true
  })
  @IsNotEmpty()
  @IsString()
  lng: string;

  @ApiProperty({
    type: String,
    required: true
  })
  @IsNotEmpty()
  @IsString()
  locationName: string;

  @ApiProperty({
    type: String,
    required: true
  })
  @IsNotEmpty()
  @IsString()
  locationId: string;
}