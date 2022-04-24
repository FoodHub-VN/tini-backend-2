import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class PaymentDtoUrl{
  @ApiProperty({
    type: String,
    required: true
  })
  @IsNotEmpty()
  @IsString()
  idOffer: string;

}