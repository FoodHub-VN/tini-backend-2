import { ApiProperty } from "@nestjs/swagger";
import { IsDate } from "class-validator";

export class AddServiceOpenTimeDto{
  @ApiProperty({
    type: Date,
    required: true
  })
  @IsDate()
  readonly openTime: string;

  @ApiProperty({
    type: Date,
    required: true
  })
  @IsDate()
  readonly closeTime: string;
}