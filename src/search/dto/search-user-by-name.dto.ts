import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty} from 'class-validator';

export class SearchUserByNameDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    type: Number,
    default: 5,
  })
  readonly limit: number;
}