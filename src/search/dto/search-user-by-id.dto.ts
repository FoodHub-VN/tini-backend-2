import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty} from 'class-validator';

export class SearchUserByIdDto {
  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNotEmpty()
  readonly id: number;
}