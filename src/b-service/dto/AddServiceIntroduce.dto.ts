import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class MenuDecriptionDto{
  @ApiProperty({
    type: String,
  })
  title: string

  @ApiProperty({
    type: Number,
  })
  price: number
}

export class AddServiceIntroduceDto {
  @ApiProperty({
    type: String,
    required: true
  })
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    type: MenuDecriptionDto,
  })
  menu: MenuDecriptionDto
}