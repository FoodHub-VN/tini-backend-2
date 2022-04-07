import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ReadNotiDto{
  @ApiProperty({
    type: String,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  readonly notiId: string;
}