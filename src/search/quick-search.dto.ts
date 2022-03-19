import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class QuickSearchDto {
  @ApiProperty({
    type: String,
    required: true
  })
  @IsNotEmpty()
  @IsString()
  searchText: string;
}