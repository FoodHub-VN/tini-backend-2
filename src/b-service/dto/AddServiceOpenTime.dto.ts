import { ApiProperty } from "@nestjs/swagger";
import { IsDate } from "class-validator";

export class AddServiceOpenTimeDto{
  @ApiProperty({
    type: Date,
    required: true
  })
  @IsDate()
  readonly openTime: Date;

  @ApiProperty({
    type: Date,
    required: true
  })
  @IsDate()
  readonly closeTime: Date;
}