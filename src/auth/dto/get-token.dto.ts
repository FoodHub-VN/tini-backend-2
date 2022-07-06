import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetTokenDto{
  @ApiProperty({
    type: String,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}