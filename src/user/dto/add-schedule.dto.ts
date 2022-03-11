import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsString } from "class-validator";

export class AddScheduleDto{
  @ApiProperty({
    type: String,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  readonly serviceId: string;

  @ApiProperty({
    type: Date,
    required: true
  })
  @IsDateString()
  @IsNotEmpty()
  readonly timeServe: Date;
}