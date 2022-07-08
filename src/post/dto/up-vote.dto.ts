import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpVoteDto {
  @ApiProperty({
    type: String,
    required: true
  })
  @IsNotEmpty()
  @IsString()
  postId: string;

}