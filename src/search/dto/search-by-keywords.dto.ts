import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty} from 'class-validator';

export class SearchByKeywordsDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  readonly keywords: string;

  @ApiProperty({
    type: Number,
    default: 5,
  })
  readonly limit: number;
}