import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class DoneScheduleDto{
  @ApiProperty({
    type: String,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  readonly id: string;
}