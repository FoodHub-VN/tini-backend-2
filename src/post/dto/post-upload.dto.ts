import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
}