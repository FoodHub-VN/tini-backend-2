import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty} from 'class-validator';

export class SearchUserByIdDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  readonly id: string;
}