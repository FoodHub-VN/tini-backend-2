import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class FollowUserDto {
  @ApiProperty({
    type: Number,
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}

export class UnFollowUserDto {
  @ApiProperty({
    type: Number,
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}