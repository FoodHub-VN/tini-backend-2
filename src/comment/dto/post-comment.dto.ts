import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty} from 'class-validator';

export class PostCommentDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  readonly postId: string;

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
  @IsNotEmpty()
  readonly content: string;
}