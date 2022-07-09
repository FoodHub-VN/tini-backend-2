import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty} from 'class-validator';

export class GetAllCommentDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  readonly id: string;

  @ApiProperty({
    type: Number,
    default: 5,
  })
  readonly limit: number;
}