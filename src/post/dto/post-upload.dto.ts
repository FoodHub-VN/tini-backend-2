import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PostUploadDto {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    required: true,
  })
  @IsOptional()
  readonly images: Array<Express.Multer.File>;
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